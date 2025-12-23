import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { LogOut, Sun, Moon } from 'lucide-react';

function SessionsHeader({ isDarkMode, toggleDarkMode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border-b px-6 py-4 flex items-center justify-between`}>
      {/* Logo - Far Left */}
      <div className="flex items-center">
        <h1 className={`text-2xl font-bold tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          PROFE SESSIONS
        </h1>
      </div>

      {/* Middle - Empty for now */}
      <div></div>

      {/* Right Side - Dark Mode Toggle + Sign Out */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleDarkMode}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm font-medium">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

export default SessionsHeader;
