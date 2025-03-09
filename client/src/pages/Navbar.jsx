import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    window.location.href = "/login";  // Redirect to login
  };
  
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          HBS
        </Link>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/rooms" className="hover:text-gray-300">Rooms</Link></li>
          <li><Link to="/check-in" className="hover:text-gray-300">Check-In</Link></li>
          <li><Link to="/billing" className="hover:text-gray-300">Billing</Link></li>
          <li><Link to="/reports" className="hover:text-gray-300">Reports</Link></li>
          <li><Link to="/settings" className="hover:text-gray-300">Settings</Link></li>
        </ul>

        <div className="hidden md:flex space-x-4">
  <button 
    onClick={handleLogout} 
    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
  >
    Logout
  </button>
</div>


        {/* Mobile Menu Button */}
        <button className="md:hidden block focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
