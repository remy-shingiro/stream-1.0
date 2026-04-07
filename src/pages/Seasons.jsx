import React, { useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { Layers } from 'lucide-react'; 
import MovieCard from '../components/MovieCard';
import useStructuredData from '../hooks/useStructuredData';

const Seasons = ({ contentData, searchTerm }) => {

  // SEO: Optimize specifically for the Series page
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Seasons & Series - Agasobanuye Filime",
    "url": "https://agasobanuyefilime.com/seasons",
  });

  if (!contentData) return null;

  // =========================================
  // SPEED OPTIMIZATION: useMemo Filtering
  // We ONLY extract items where type === 'series'
  // =========================================
  const seriesData = useMemo(() => {
    const searchLower = searchTerm?.toLowerCase() || '';
    return contentData.filter((item) => 
      item.type === 'series' && item.title.toLowerCase().includes(searchLower)
    );
  }, [contentData, searchTerm]);

  return (
    // UX FIX: Added pt-24 or pt-28 so the grid doesn't hide behind the fixed Navbar!
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-28 pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
           <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_15px_#dc2626]"></div>
           <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide drop-shadow-lg flex items-center gap-3">
             <Layers className="text-red-500 hidden sm:block" size={32} />
             {searchTerm ? `Results: "${searchTerm}"` : "Season Zose"}
           </h1>
           <span className="ml-auto bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
             Hariho Seasons {seriesData.length} 
           </span>
        </div>

        {/* FULL GRID DISPLAY */}
        {seriesData.length > 0 ? (
          /* SPEED OPTIMIZATION: content-visibility for large lists */
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 animate-in fade-in duration-500"
            style={{ contentVisibility: 'auto' }}
          >
            {seriesData.map((item, index) => (
              <Link 
                key={item.id} 
                to={`/movie/${item.id}`} 
                className="block w-full group"
              >
                <MovieCard movie={item} index={index} />
              </Link>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 opacity-50">
              <div className="text-6xl mb-4">😕</div>
              <p className="text-xl font-bold uppercase tracking-wider">Nta Season ibonetse</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default React.memo(Seasons);