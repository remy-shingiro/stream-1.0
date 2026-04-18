import { useLocation, Link } from 'react-router-dom';
import { Home, Film, MonitorPlay, Search } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  // Helper to check if a tab is active to highlight it in Red
  const isActive = (path) => location.pathname === path;

  // Triggers the mobile search bar from Navbar.jsx
  const openSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('openMobileSearch'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0f0f0f]/95 backdrop-blur-md border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        
        {/* 1. Home Tab */}
        <Link to="/" className="flex flex-col items-center justify-center w-full h-full gap-1 group">
          <Home size={22} className={isActive('/') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-200'} />
          <span className={`text-[10px] font-bold ${isActive('/') ? 'text-red-600' : 'text-gray-400'}`}>Ahabanza</span>
        </Link>

        {/* 2. Full Movies Tab */}
        <Link to="/movies" className="flex flex-col items-center justify-center w-full h-full gap-1 group">
          <Film size={22} className={isActive('/movies') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-200'} />
          <span className={`text-[10px] font-bold ${isActive('/movies') ? 'text-red-600' : 'text-gray-400'}`}>Filime</span>
        </Link>

        {/* 3. Series Tab */}
        <Link to="/seasons" className="flex flex-col items-center justify-center w-full h-full gap-1 group">
          <MonitorPlay size={22} className={isActive('/seasons') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-200'} />
          <span className={`text-[10px] font-bold ${isActive('/seasons') ? 'text-red-600' : 'text-gray-400'}`}>Series</span>
        </Link>

        {/* 4. Search Button */}
        <button onClick={openSearch} className="flex flex-col items-center justify-center w-full h-full gap-1 group">
          <Search size={22} className="text-gray-400 group-hover:text-gray-200" />
          <span className="text-[10px] font-bold text-gray-400">Shakisha</span>
        </button>

      </div>
    </div>
  );
};

export default MobileBottomNav;