import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Film, MonitorPlay, Search, User, LogOut } from 'lucide-react';

// 🚀 AUTH IMPORTS
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthModal from './AuthModal';

const MobileBottomNav = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  // 🚀 AUTH STATES
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sync active state with URL
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/') setActiveIndex(0);
    else if (currentPath === '/movies') setActiveIndex(1);
    else if (currentPath === '/seasons') setActiveIndex(2);
  }, [location.pathname]);

  // Listen for login/logout changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🚀 ADDED THE AUTH ITEM TO NAV
  const navItems = [
    { id: 0, label: 'Ahabanza', path: '/', icon: Home },
    { id: 1, label: 'Filime', path: '/movies', icon: Film },
    { id: 2, label: 'Series', path: '/seasons', icon: MonitorPlay },
    { id: 3, label: 'Shakisha', action: 'search', icon: Search },
    { id: 4, label: 'Konti', action: 'auth', icon: User }, 
  ];

  const handleSearchClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('openMobileSearch'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🚀 AUTH CLICK HANDLER
  const handleAuthClick = (e) => {
    e.preventDefault();
    if (user) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowMobileMenu(false);
    window.location.reload(); 
  };

  return (
    <>
      {/* 🚀 LOGOUT POPUP (Floats just above the nav pill) */}
      {showMobileMenu && user && (
        <div className="md:hidden fixed bottom-24 right-[5%] z-50 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 w-48 animate-in slide-in-from-bottom-4">
          <div className="px-4 py-3 border-b border-white/5 mb-1">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Wamaze kwinjira</p>
            <p className="text-xs text-white truncate font-bold">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-xs font-bold"
          >
            <LogOut size={16} /> Sohoka (Log Out)
          </button>
        </div>
      )}

      {/* Floating Pill Design */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] z-40 pb-safe">
        <div className="flex justify-around items-center h-16 px-1 sm:px-2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          
          {navItems.map((item) => {
            // Keep the "active" visual state if it's the current route OR if the user menu is open
            const isActive = activeIndex === item.id || (item.action === 'auth' && showMobileMenu);
            const isSearch = item.action === 'search';
            const isAuth = item.action === 'auth';

            const content = (
              <div className="relative flex flex-col items-center justify-center w-full h-full gap-1 group">
                
                {/* 🚀 If user is logged in, show their initial instead of the generic User icon */}
                <div
                  className="relative z-10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.26,1.55)]"
                  style={{ transform: isActive ? 'translateY(-2px) scale(1.1)' : 'translateY(0) scale(1)' }}
                >
                  {isAuth && user ? (
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center text-black font-black text-[10px] transition-colors duration-500 ${isActive ? 'bg-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-gray-400'}`}>
                        {user.email.charAt(0).toUpperCase()}
                     </div>
                  ) : (
                    <item.icon
                      size={20}
                      className={`transition-colors duration-500 ${
                        isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-gray-400 group-hover:text-gray-200'
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  )}
                </div>

                <span
                  className={`text-[9px] font-bold tracking-widest uppercase transition-all duration-500 ${
                    isActive ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                  style={{ transform: isActive ? 'translateY(-1px)' : 'translateY(0)' }}
                >
                  {item.label}
                </span>
              </div>
            );

            // Handle Search Button
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

            // Handle Auth/User Button
            if (isAuth) {
              return (
                <button
                  key={item.id}
                  onClick={handleAuthClick}
                  className="relative flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
                >
                  {content}
                </button>
              );
            }

            // Standard Navigation Links
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveIndex(item.id);
                  setShowMobileMenu(false); // Close user menu if open
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

      {/* Global Auth Modal for Mobile */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default MobileBottomNav;