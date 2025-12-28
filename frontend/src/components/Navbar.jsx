import React, { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import pwrLogo from "../public/pwr-logo-horizontal.png";
import { Search } from "lucide-react";
import { ROLES } from '../config.js'

const Navbar = ({ user, onLogout, searchValue, onSearchChange, onSearchSubmit, navigateOnSearch = true }) => {
  const navigate = useNavigate();
  const [localSearchValue, setLocalSearchValue] = useState("");

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleSearchChange = (value) => {
    if (searchValue !== undefined) {
      // Controlled by parent
      if (onSearchChange) {
        onSearchChange(value);
      }
    } else {
      // Local state for uncontrolled usage
      setLocalSearchValue(value);
    }
  };

  const handleSearchSubmit = (searchTerm) => {
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm); // custom search logic
    } else if (navigateOnSearch) {
      // Default behavior: navigate to topics page with search
      navigate(`/topics?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const currentSearchValue = searchValue !== undefined ? searchValue : localSearchValue;

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(currentSearchValue);
    }
  };

  const handleSearchClick = () => {
    handleSearchSubmit(currentSearchValue);
  };

  return (
  <nav className="bg-gray-300 shadow-md">
    <div className="relative flex items-center h-16 px-4 py-10">
      <div className="flex-shrink-0 hidden md:block">
        <img src={pwrLogo} alt="PWR Logo" className="h-10 w-auto" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-2xl font-bold text-zinc-800 whitespace-nowrap">
          System wspomagania ZPI
        </div>
      </div>
    </div>

    {user && (
      <div className="flex flex-wrap items-stretch min-h-16 border-t-2 border-b-2 border-gray-600 bg-white">
        <NavLink
          to="/zpi"
          className={({ isActive }) =>
            `h-16 px-4 border-r border-gray-600 flex items-center text-sm text-zinc-800
             ${isActive ? "bg-gray-300 font-bold" : "hover:bg-gray-50"}`
          }
        >
          {user.role.role_name === ROLES.KPK_MEMBER ? "Moje opinie" : "Moje ZPI"}
        </NavLink>

        <NavLink
          to="/topics"
          className={({ isActive }) =>
            `h-16 px-4 border-r border-gray-600 flex items-center text-sm text-zinc-800
             ${isActive ? "bg-gray-300 font-bold" : "hover:bg-gray-50"}`
          }
        >
          Tematy
        </NavLink>

        <div className="flex items-center px-4 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Wyszukaj…"
            value={currentSearchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full text-sm px-3 py-2 text-zinc-800 border-2 border-gray-300 rounded-sm"
          />
          <button 
            onClick={handleSearchClick}
            className="ml-3 text-zinc-800">
            <Search size={20} />
          </button>
        </div>

        <div className="ml-auto flex items-center space-x-4 h-16 px-2">
          <span className="hidden lg:block text-sm font-bold text-zinc-800">
            Zalogowano jako:
          </span>

          <Link to="/user" className="hidden md:block text-sm text-zinc-800">
            {user.name} {user.surname}
          </Link>

          <button
            onClick={handleLogout}
            className="h-full px-4 border-l border-gray-600 flex items-center text-sm text-zinc-800 hover:bg-gray-50"
          >
            Wyloguj się
          </button>
        </div>
      </div>
    )}
  </nav>
);

};

export default Navbar;
