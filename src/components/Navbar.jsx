import { useState } from 'react';

const Navbar = ({ onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      if (onSearch) onSearch(searchQuery);
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
    }
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
    <nav className="bg-brand-dark/95 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo links to Home */}
          <a href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border-2 border-red-600 flex items-center justify-center group-hover:border-red-500 transition">
              <span className="text-red-600 font-bold text-xl group-hover:text-red-500">▶</span>
            </div>
            <div className="flex flex-col">
              <span className="text-brand-gold font-bold text-xl leading-none">Agasobanuye</span>
              <span className="text-white text-xs tracking-widest">FILIME</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
            <a href="/" className="hover:text-brand-gold transition">Ahabanza</a>
            <a href="/seasons" className="hover:text-brand-gold transition">Action</a>
            <a href="/seasons" className="hover:text-brand-gold transition">Seasons</a>
            <a href="/" className="hover:text-brand-gold transition">Film zose</a>
          </div>

          {/* Right Side: Search & Menu Toggle */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shakisha filme..." 
                // 👇 FIXED LINE BELOW 👇
                // 1. w-40: Default width
                // 2. md:w-48: Slightly wider on tablet, but STATIC (no focus growth)
                // 3. lg:w-48: Base width on Desktop
                // 4. lg:focus:w-64: ONLY expands on Large Screens (Desktop)
                className="bg-white text-black pl-3 pr-10 py-2 rounded-sm text-sm focus:outline-none w-40 md:w-48 lg:w-48 lg:focus:w-64 transition-all"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 bg-brand-gold text-black rounded-r-sm hover:bg-yellow-500">
                🔍
              </button>
            </form>

            {/* Mobile Search Icon */}
            <button onClick={toggleSearch} className="md:hidden text-gray-300 hover:text-brand-gold focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Icon */}
            <button onClick={toggleMenu} className="md:hidden text-gray-300 hover:text-white focus:outline-none">
              {isMobileMenuOpen ? <span className="text-2xl">✖</span> : <span className="text-2xl">☰</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden bg-brand-dark p-4 border-b border-white/10 animate-fade-in-down">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
             <input 
              type="text" 
              autoFocus 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Shakisha..." 
              className="flex-1 bg-white text-black px-3 py-2 rounded-sm text-sm focus:outline-none"
            />
            <button type="submit" className="bg-brand-gold text-black px-4 py-2 rounded-sm font-bold">🔍</button>
          </form>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-brand-gold hover:bg-white/5">Ahabanza</a>
            <a href="/seasons" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-brand-gold hover:bg-white/5">Action</a>
            <a href="/seasons" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-brand-gold hover:bg-white/5">Categories</a>
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-brand-gold hover:bg-white/5">Film zose</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;