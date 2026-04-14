import { Link, useLocation } from 'react-router-dom';
import { Home, FolderKanban, Settings, Bug, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Bug className="text-indigo-500 mr-3" size={24} />
        <span className="text-xl font-bold text-white tracking-tight">BugTracker</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Menu</div>
        {links.map((link) => {
          const active = isActive(link.path);
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                active 
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <link.icon size={18} className={`mr-3 ${active ? 'text-indigo-500' : 'text-gray-500'}`} />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={logout}
          className="flex w-full items-center px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={18} className="mr-3 text-gray-500 group-hover:text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
