import React from "react";
import pwrLogo from "../public/pwr-logo-horizontal.png";

// poprawic wysrodkowanie i co gdy przegladarka sie zwęża
const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-300 text-white px-4 py-3 shadow-md">
      <div className="relative flex items-center h-16 px-4">
        {/* Logo po lewej */}
        <div className="flex-shrink-0">
            <img src={pwrLogo} alt="PWR Logo" className="h-10 w-auto" />
        </div>

        {/* Wyśrodkowany tekst */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold text-zinc-800 whitespace-nowrap">System wspomagania ZPI</div>
        </div>

        {/* User info and logout po prawej */}
        <div className="flex-shrink-0 ml-auto flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-zinc-800 hidden sm:block">
                {user.name} {user.surname}
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Wyloguj
              </button>
            </>
          )}
        </div>
        </div>
    </nav>
  );
};

export default Navbar;
