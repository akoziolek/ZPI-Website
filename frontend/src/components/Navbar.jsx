import React from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import pwrLogo from "../public/pwr-logo-horizontal.png";
import { Search } from "lucide-react";
import { ROLES } from '../config.js'

// poprawic wysrodkowanie i co gdy przegladarka sie zwęża
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
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

    {/* dolny pasek */}
    {user && (
      <div className="flex flex-wrap items-stretch min-h-16 border-t-2 border-b-2 border-gray-600 bg-white">
        {/* linki */}
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

        {/* wyszukiwarka */}
        <div className="flex items-center px-4 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Wyszukaj…"
            className="w-full text-sm px-3 py-2 text-zinc-800 border-2 border-gray-300 rounded-sm"
          />
          <button className="ml-3 text-zinc-800">
            <Search size={20} />
          </button>
        </div>

        {/* prawa strona */}
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
