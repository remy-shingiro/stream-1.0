import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Plus } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const Movies = ({ contentData, searchTerm }) => {
  // Performance: Only render 20 DOM nodes initially
  const [visibleCount, setVisibleCount] = useState(20);

  // Filter logic: Reject series, apply search term if it exists
  const displayMovies = useMemo(() => {
    if (!contentData) return [];
    
    const searchLower = searchTerm?.toLowerCase() || '';
    
    return contentData.filter((item) => {
      // Must NOT be a series
      const isMovie = item.type !== 'series';
      // Must match search term
      const matchesSearch = item.title.toLowerCase().includes(searchLower);
      
      return isMovie && matchesSearch;
    });
  }, [contentData, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <div className="w-1.5 h-8 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide drop-shadow-lg flex items-center gap-3">
          <Film className="text-amber-400" size={28} />
          {searchTerm ? `Results: "${searchTerm}"` : "Filime Zose"}
        </h1>
      </div>

      {/* Grid */}
      {displayMovies.length > 0 ? (
        <>
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
            style={{ contentVisibility: 'auto' }}
          >
            {displayMovies.slice(0, visibleCount).map((item, index) => (
              <Link 
                key={item.id} 
                to={`/movie/${item.id}`} 
                className="block w-full group"
              >
                <MovieCard movie={item} index={index} />
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < displayMovies.length && (
            <div className="flex justify-center mt-12 mb-8">
              <button 
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-full border border-slate-700 hover:border-amber-400 transition-all duration-300 uppercase tracking-widest text-sm shadow-xl hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]"
              >
                <Plus size={18} className="text-amber-400" />
                Load More Movies
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-32 text-slate-500 opacity-50">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl font-bold">Nta filime ibonetse</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(Movies);