import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Add this import
import ThemeToggle from '../common/ThemeToggle'; // Add this import
import { 
  LayoutDashboard, 
  Target, 
  Timer, 
  BarChart3, 
  LogOut, 
  User 
} from 'lucide-react';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Habits',
      path: '/habits',
      icon: Target
    },
    {
      name: 'Timer',
      path: '/timer',
      icon: Timer
    },
    {
      name: 'Statistics',
      path: '/stats',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FocusFlow</span>
              </div>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'border-primary-500 text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* User Menu with Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <ThemeToggle />
              
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
              >
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </div>
              </NavLink>
            ))}
            
            {/* Mobile Theme Toggle */}
            <div className="pl-3 pr-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
