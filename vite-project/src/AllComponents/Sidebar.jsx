// src/AllComponents/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <div className="w-70 text-2xl font-bold mb-6">
        App Dashboard
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/navigation"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              SPACE EXPLORE
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/health"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              HEALTH ISSUE
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/physico"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              PSYCHOLOGICAL
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/communication"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              COMMUNICATION
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/spavenova"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              STUDY ANALYSIS SPACE MONO
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Astrofategue"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              ASTRO EXPLOIS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/FoodStorage"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-400"
                }`
              }
            >
              FOOD STORAGE
            </NavLink>
          </li>
        </ul>
      </nav>
       </div>
    </div>
  );
};

export default Sidebar;