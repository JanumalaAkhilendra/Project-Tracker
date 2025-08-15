import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FiHome, FiFolder, FiUsers, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      to: '/dashboard',
      icon: FiHome,
      label: 'Dashboard',
      badge: null,
      description: 'Overview & metrics'
    },
    {
      to: '/projects',
      icon: FiFolder,
      label: 'Projects',
      badge: '12',
      description: 'Manage projects'
    },
    {
      to: '/team',
      icon: FiUsers,
      label: 'Team',
      badge: null,
      description: 'Team members'
    },
    {
      to: '/settings',
      icon: FiSettings,
      label: 'Settings',
      badge: null,
      description: 'Preferences'
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white/70 backdrop-blur-md shadow-xl border-r border-gray-200/50 transition-all duration-300 ease-in-out flex flex-col min-h-screen`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Navigation</h2>
                <p className="text-xs text-gray-500">Quick access</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {isCollapsed ? (
              <FiChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <FiChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `group relative flex items-center p-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg shadow-blue-100/50 scale-105' 
                        : 'text-gray-700 hover:bg-gray-50/70 hover:text-gray-900 hover:scale-105 hover:shadow-md'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full"></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg' 
                          : 'bg-gray-100/70 text-gray-600 group-hover:bg-gray-200/70'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {!isCollapsed && (
                        <>
                          {/* Label and Description */}
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm truncate">
                                {item.label}
                              </p>
                              {item.badge && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isActive 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200/50">
        {!isCollapsed ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Upgrade to Pro
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Get unlimited projects and advanced features
                </p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold py-2 px-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl group relative">
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Upgrade to Pro
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;