import { useState, useRef, useEffect } from 'react';
import { Search, X, Menu } from 'lucide-react'; 

const Navbar = ({ onSearch, data = [], onItemClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // 1. PERFORMANCE: Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) onSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); 
    
    // Suggestions logic
    if (query.trim().length > 1 && data.length > 0) {
      const matches = data
        .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movie) => {
    setSearchQuery('');      
    setSuggestions([]);      
    setIsSearchOpen(false);   
    if (onItemClick) onItemClick(movie); 
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#0f0f0f]/95 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md" ref={searchRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* --- LOGO --- */}
          <a href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border-2 border-red-600 flex items-center justify-center group-hover:border-red-500 transition">
              <span className="text-red-600 font-bold text-xl group-hover:text-red-500 pt-0.5 pl-0.5">▶</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#fbbf24] font-bold text-xl leading-none uppercase">Agasobanuye</span>
              <span className="text-white text-xs tracking-widest font-black">FILIME</span>
            </div>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="px-5 py-2 rounded-md bg-[#fbbf24] text-black font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-colors shadow-md">Ahabanza</a>
            <a href="/seasons" className="px-5 py-2 rounded-md bg-[#fbbf24] text-black font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-colors shadow-md">Action</a>
            <a href="/seasons" className="px-5 py-2 rounded-md bg-[#fbbf24] text-black font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-colors shadow-md">Seasons</a>
            <a href="/" className="px-5 py-2 rounded-md bg-[#fbbf24] text-black font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-colors shadow-md">Film zose</a>
          </div>

          {/* --- RIGHT SIDE: SEARCH & MENU --- */}
          <div className="flex items-center gap-4 relative">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Shakisha filme..." 
                className="bg-white text-black pl-3 pr-10 py-2 rounded-sm text-sm focus:outline-none w-40 md:w-48 lg:w-48 lg:focus:w-64 transition-all"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-[#fbbf24] text-black rounded-r-sm hover:bg-yellow-500 flex items-center justify-center pointer-events-none">
                  <Search size={16} />
              </button>

              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-[#0f0f0f] border border-white/10 rounded-md shadow-2xl overflow-hidden z-50">
                  {suggestions.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => handleSuggestionClick(movie)}
                      className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                      <img src={movie.poster_url || movie.image} alt={movie.title} className="w-10 h-14 object-cover rounded shadow" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-white text-sm font-medium truncate uppercase">{movie.title}</span>
                        <span className="text-gray-500 text-[10px] font-bold uppercase">{movie.type === 'series' ? 'Series' : 'Movie'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleSearch} className="md:hidden text-gray-300 hover:text-[#fbbf24]">
              <Search size={24} />
            </button>
            <button onClick={toggleMenu} className="md:hidden text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/10 animate-in slide-in-from-top">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="/" className="block px-3 py-4 rounded-md text-sm font-black text-black bg-[#fbbf24] hover:bg-red-600 hover:text-white transition-colors uppercase">Ahabanza</a>
            <a href="/seasons" className="block px-3 py-4 rounded-md text-sm font-black text-black bg-[#fbbf24] hover:bg-red-600 hover:text-white transition-colors uppercase">Action</a>
            <a href="/seasons" className="block px-3 py-4 rounded-md text-sm font-black text-black bg-[#fbbf24] hover:bg-red-600 hover:text-white transition-colors uppercase">Seasons</a>
            <a href="/" className="block px-3 py-4 rounded-md text-sm font-black text-black bg-[#fbbf24] hover:bg-red-600 hover:text-white transition-colors uppercase">Film zose</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;