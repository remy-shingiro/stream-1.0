import React, { useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { Layers, ChevronRight, MonitorPlay } from 'lucide-react'; 
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import useStructuredData from '../hooks/useStructuredData';

const Home = ({ contentData, onMovieClick, searchTerm }) => {

  // SEO: Remains intact for rich search results
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Agasobanuye Filime",
    "url": "https://agasobanuyefilime.com/",
  });
  
  if (!contentData) return null;

  // =========================================
  // SPEED OPTIMIZATION 1: useMemo for Filtering
  // Prevents recalculating these arrays on every tiny re-render
  // =========================================
  const { filteredContent, seriesData, moviesData } = useMemo(() => {
    const searchLower = searchTerm?.toLowerCase() || '';
    const filtered = contentData.filter((item) =>
      item.title.toLowerCase().includes(searchLower)
    );

    return {
      filteredContent: filtered,
      seriesData: filtered.filter(item => item.type === 'series'),
      moviesData: filtered.filter(item => item.type !== 'series')
    };
  }, [contentData, searchTerm]);


  return (
    <div className="min-h-screen bg-slate-950 pt-0 mt-0 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      {!searchTerm && (
        <div className="pt-0 mt-0 relative z-0"> 
          {/* 🚀 RANDOMIZATION FIX: Pass ALL contentData, not just the first 5! */}
          <Hero 
            movies={contentData} 
            onPlay={(movie) => window.location.href = `/movie/${movie.id}`} 
          />
        </div>
      )}

      {/* Main Content Wrapper - Note the relative z-10 so it sits above Hero gradients */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-8 relative z-10 space-y-12">
        
        {/* =========================================
            2. TRENDING SERIES ROW (With Netflix Bleed)
            ========================================= */}
        {(!searchTerm && seriesData.length > 0) && (
          <section>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_15px_#dc2626]"></div>
                 <h2 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-lg flex items-center gap-2">
                   <MonitorPlay className="text-red-500" size={24} />
                   Season zigezweho
                 </h2>
               </div>

               <Link 
                 to="/seasons" 
                 className="group flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 border border-slate-800 hover:border-slate-600 shrink-0"
               >
                 <Layers size={16} />
                 <span>Kanda aha ubone Season zose</span>
                 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            {/* SPEED OPTIMIZATION 2: will-change-scroll
                UX FIX: Bleed layout (-mx-4 px-4) + Scroll Padding (scroll-pl-4)
                so the hover states aren't chopped and snapping aligns perfectly.
            */}
            <div 
              className="flex overflow-x-auto gap-4 py-6 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                willChange: 'scroll-position' 
              }}
            >
              <style>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              
              {/* Only slice what we need to render initially for the row */}
              {seriesData.slice(0, 30).map((item, index) => (
                <Link 
                  key={item.id} 
                  to={`/movie/${item.id}`} 
                  // Set explicit width to prevent layout shift (CLS) while images load
                  className="block w-[160px] md:w-[192px] lg:w-[224px] shrink-0 snap-start group"
                >
                  <MovieCard movie={item} index={index} />
                </Link>
              ))}
              
              {/* UX FIX: Spacer width exactly matches screen padding so the last card isn't cut off */}
              <div className="w-4 shrink-0 sm:w-6 lg:w-8" aria-hidden="true"></div>
            </div>
          </section>
        )}

        {/* =========================================
            3. MAIN MOVIE GRID 
            ========================================= */}
        <section>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
             <div className="w-1.5 h-8 bg-[#fbbf24] rounded-full shadow-[0_0_15px_#fbbf24]"></div>
             <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide drop-shadow-lg">
               {searchTerm ? `Results: "${searchTerm}"` : "Filime Nshya & Collections"}
             </h2>
          </div>

          {filteredContent.length > 0 ? (
            /* SPEED OPTIMIZATION 3: content-visibility
               Tells the browser NOT to render the heavy styling of cards that are off-screen.
            */
            <div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
              style={{ contentVisibility: 'auto' }}
            >
              {(searchTerm ? filteredContent : moviesData).map((item, index) => (
                <Link 
                  key={item.id} 
                  to={`/movie/${item.id}`} 
                  className="block w-full group"
                >
                  {/* Assuming MovieCard has lazy loading built-in for the images! */}
                  <MovieCard movie={item} index={index} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500 opacity-50">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-xl font-bold">Nta filime ibonetse</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

// SPEED OPTIMIZATION 4: React.memo
// Prevents the entire Home component from re-rendering if parent state changes
// but the contentData/searchTerm haven't changed.
export default React.memo(Home);