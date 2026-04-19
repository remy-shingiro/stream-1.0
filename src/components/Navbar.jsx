import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react'; 

const Navbar = ({ onSearch, data = [], onItemClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false); // 🚀 NEW: Tracks scroll position
  const searchRef = useRef(null);

  // 🚀 NEW: Scroll Listener for the "Lavish" Sticky Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Performance: Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch && searchQuery.trim() !== '') {
        onSearch(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
        setIsSearchOpen(false); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for the Bottom Nav "Shakisha" click
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsSearchOpen(true);
    };
    window.addEventListener('openMobileSearch', handleOpenSearch);
    return () => window.removeEventListener('openMobileSearch', handleOpenSearch);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); 
    
    if (query.trim().length > 1 && data.length > 0) {
      const matches = data
        .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleManualSearch = () => {
    if (onSearch && searchQuery.trim() !== '') {
      onSearch(searchQuery);
      setSuggestions([]); 
      setIsSearchOpen(false); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleManualSearch();
  };

  const handleSuggestionClick = (movie) => {
    setSearchQuery('');      
    setSuggestions([]);      
    setIsSearchOpen(false);   
    if (onItemClick) onItemClick(movie); 
  };

  return (
    // 🚀 FIXED: Dynamic Scroll Styling.
    // Changes from a seamless top gradient to a frosted glassmorphic bar on scroll.
    // Changed absolute/sticky to `fixed top-0 w-full` for reliable stickiness.
    <nav 
      ref={searchRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-slate-900/85 backdrop-blur-2xl border-b-0 border-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] py-0' 
          : 'bg-gradient-to-b-0 from-slate-950/90 to-transparent border-b-0 border-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Adjusted height to be slightly slimmer for a more premium feel */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-4 transition-all duration-500">
          
          {/* --- LOGO --- */}
          <a href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-red-600 flex items-center justify-center group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300">
              <span className="text-red-600 font-bold text-lg md:text-xl group-hover:text-red-500 pt-0.5 pl-0.5">▶</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#fbbf24] font-black text-lg md:text-xl leading-none uppercase tracking-wide">Agasobanuye</span>
              <span className="text-gray-300 text-[10px] md:text-xs tracking-[0.2em] font-bold">FILIME</span>
            </div>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          {/* Replaced bulky yellow buttons with sleek, minimalist text links and hover accents */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-amber-400 transition-colors relative group">
              Ahabanza
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/movies" className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-amber-400 transition-colors relative group">
              Filime
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/seasons" className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-amber-400 transition-colors relative group">
              Series
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* --- RIGHT SIDE: DESKTOP SEARCH --- */}
          {/* Note: Hidden on mobile because MobileBottomNav handles mobile search triggers */}
          <div className="hidden md:flex items-center gap-4 relative">
            
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Shakisha filime..." 
                className="bg-slate-800/50 text-white placeholder-gray-400 border border-white/10 pl-4 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-slate-800 w-48 lg:focus:w-64 transition-all duration-300 backdrop-blur-sm"
              />
              <button 
                onClick={handleManualSearch}
                className="absolute right-1 top-1 h-8 w-8 bg-amber-400 text-black rounded-full hover:bg-white flex items-center justify-center cursor-pointer transition-colors shadow-md"
              >
                  <Search size={14} strokeWidth={3} />
              </button>

              {/* Desktop Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-4 right-0 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {suggestions.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => handleSuggestionClick(movie)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                      <img src={movie.poster_url || movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded-md shadow-md" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-white text-sm font-bold truncate uppercase">{movie.title}</span>
                        <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">{movie.type === 'series' ? 'Series' : 'Movie'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH BAR EXPANSION (Triggered by Bottom Nav) --- */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-3xl border-b border-white/10 p-4 shadow-2xl animate-in slide-in-from-top-2 z-50">
          <div className="relative w-full flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Shakisha filime..." 
                autoFocus
                className="w-full bg-slate-800 text-white placeholder-gray-400 border border-white/10 pl-4 pr-12 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />
              <button 
                onClick={handleManualSearch}
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-amber-400 text-black rounded-full flex items-center justify-center hover:bg-white cursor-pointer transition-colors shadow-md"
              >
                  <Search size={16} strokeWidth={3} />
              </button>
            </div>
            
            {/* Close Search Button */}
            <button 
              onClick={() => { setIsSearchOpen(false); setSuggestions([]); }} 
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 w-full bg-slate-800 border border-white/5 rounded-xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
              {suggestions.map((movie) => (
                <div 
                  key={movie.id} 
                  onClick={() => handleSuggestionClick(movie)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                >
                  <img src={movie.poster_url || movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded-md shadow-md" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-bold truncate uppercase">{movie.title}</span>
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">{movie.type === 'series' ? 'Series' : 'Movie'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;