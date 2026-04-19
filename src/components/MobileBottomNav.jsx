import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Film, MonitorPlay, Search } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { id: 0, label: 'Ahabanza', path: '/', icon: Home },
    { id: 1, label: 'Filime', path: '/movies', icon: Film },
    { id: 2, label: 'Series', path: '/seasons', icon: MonitorPlay },
    { id: 3, label: 'Shakisha', action: 'search', icon: Search },
  ];

  // Sync active state with URL
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/') setActiveIndex(0);
    else if (currentPath === '/movies') setActiveIndex(1);
    else if (currentPath === '/seasons') setActiveIndex(2);
  }, [location.pathname]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('openMobileSearch'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // 🚀 FIXED: Floating Pill Design (rounded-full) hovering slightly off the bottom (bottom-4)
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-40 pb-safe">
      <div className="flex justify-around items-center h-16 px-2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        
        {navItems.map((item) => {
          const isActive = activeIndex === item.id;
          const isSearch = item.action === 'search';

          const content = (
            <div className="relative flex flex-col items-center justify-center w-full h-full gap-1 group">
              
              {/* 🚀 ANIMATION: Icon slightly scales and pops up when active */}
              <div
                className="relative z-10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.26,1.55)]"
                style={{
                  transform: isActive ? 'translateY(-2px) scale(1.1)' : 'translateY(0) scale(1)'
                }}
              >
                <item.icon
                  size={20}
                  className={`transition-colors duration-500 ${
                    isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>

              {/* 🚀 FIXED: Text is ALWAYS visible, just changes color and lifts slightly when active */}
              <span
                className={`text-[9px] font-bold tracking-widest uppercase transition-all duration-500 ${
                  isActive ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'
                }`}
                style={{
                  transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
                }}
              >
                {item.label}
              </span>
            </div>
          );

          if (isSearch) {
            return (
              <button
                key={item.id}
                onClick={handleSearchClick}
                className="relative flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => {
                setActiveIndex(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative flex-1 h-full flex items-center justify-center"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;