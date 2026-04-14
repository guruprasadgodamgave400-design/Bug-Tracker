import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="flex-1 max-w-lg relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search for tickets, projects..." 
          className="w-full bg-gray-800 border-none text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 pl-6 border-l border-gray-800">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-white">{user?.name}</div>
            <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
