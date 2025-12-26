import React from "react";
import pwrLogo from "../public/pwr-logo-horizontal.png";

// poprawic wysrodkowanie i co gdy przegladarka sie zwęża
const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-300 text-white shadow-md">
      <div className="relative flex items-center h-16 px-4 py-10">
        <div className="flex-shrink-0">
            <img src={pwrLogo} alt="PWR Logo" className="h-10 w-auto" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold text-zinc-800 whitespace-nowrap">System wspomagania ZPI</div>
        </div>
      </div>
      
      {user && (
        <div className="flex items-stretch h-16 border border-gray-300 bg-white">
          <a href="/zpi" className="h-full px-4 border-r border-gray-300 flex items-center text-sm text-zinc-800 hover:bg-gray-50">
            Moje ZPI</a>
          <a href="/tematy" className="h-full px-4 border-r border-gray-300 flex items-center text-sm text-zinc-800 hover:bg-gray-50">
            Tematy</a>

          <div className="flex items-center px-4">
            <input
              type="text"
              placeholder="Wyszukaj…"
              className="text-sm px-4 py-2 text-zinc-800 border-2 rounded-sm border-gray-300 min-w-lg"
            />
            {/*Ikonka wyszukiwnaia? */}
          </div>

          <div className="ml-auto flex items-center space-x-4 h-full">
            <span className="text-sm font-bold text-zinc-800 hidden sm:block">
              Zalogowano jako:
            </span>
            <span className="text-sm text-zinc-800 hidden sm:block">
              {user.name} {user.surname}
            </span>

            <button
              onClick={onLogout}
              className="h-full px-4 border-l border-gray-300 flex items-center text-sm text-zinc-800 hover:bg-gray-50"
            >Wyloguj się</button>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
