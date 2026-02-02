import { useState, useEffect } from 'react';
import { Play } from 'lucide-react'; 

const Hero = ({ movies = [], onPlay }) => {
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const desktopMovies = movies.slice(0, 3);
  const mobileMovies = movies.slice(0, 5); 
  const currentMovie = mobileMovies[currentMobileIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMobileIndex((prev) => (prev + 1) % mobileMovies.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [mobileMovies.length]);

  // --- 🚀 PERFORMANCE FIX: SMART IMAGE RESIZING ---
  // Instead of 'original' (which can be 20MB), we use 'w1280' (HD) or 'w780' (Mobile HD)
  const getOptimizedUrl = (url, isMobile = false) => {
    if (!url) return '';
    
    // 1. If it's a YouTube thumbnail, upgrade it
    if (url.includes('sddefault')) return url.replace('sddefault', 'maxresdefault');
    
    // 2. If it's a TMDB image (has /w300/ or /w500/)
    if (url.includes('/w300/') || url.includes('/w500/') || url.includes('/w780/')) {
       // Mobile: w780 is plenty sharp (and fast)
       // Desktop: w1280 is Full HD (fast) vs 'original' (slow 4K)
       const targetSize = isMobile ? 'w780' : 'w1280';
       return url.replace(/\/w[0-9]+\//, `/${targetSize}/`);
    }
    
    return url;
  };

  const getBadge = (movie) => {
    if (movie.type === 'series') return `Season ${movie.seasons?.length || 1}`;
    if (movie.type === 'collection') return `${movie.seasons?.[0]?.episodes?.length || 1} Parts`;
    return 'HD';
  };

  return (
    <div className="w-full bg-[#0f0f0f]">
      
      {/* =======================
          MOBILE VIEW
         ======================= */}
      <div className="block md:hidden w-full px-4 pt-24 pb-6">
        <div 
          key={currentMobileIndex}
          className="relative h-[65vh] w-full rounded-3xl overflow-hidden group border border-brand-gold/30 shadow-[0_0_25px_-5px_rgba(255,215,0,0.3)] animate-in fade-in duration-700"
        >
          <div className="absolute inset-0">
            <img 
              // 🚀 Load 'w780' (Mobile HD)
              src={getOptimizedUrl(currentMovie.poster_url || currentMovie.image, true)} 
              alt={currentMovie.title}
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
          </div>

          <div className="absolute top-4 right-4 z-20">
             <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
               {getBadge(currentMovie)}
             </span>
          </div>

          <div className="relative h-full flex flex-col justify-end px-5 pb-8 z-10">
            <h1 className="text-3xl font-black mb-3 leading-none text-white drop-shadow-2xl uppercase line-clamp-2">
              {currentMovie.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-xs font-medium mb-4">
                <span>{currentMovie.year || '2025'}</span>
                <span className="w-1 h-1 bg-brand-gold rounded-full"></span>
                <span className="uppercase text-brand-gold">{currentMovie.genre || 'Action'}</span>
            </div>
            <button onClick={() => onPlay(currentMovie)} className="bg-brand-gold text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform w-fit">
              <Play fill="black" size={18} />
              <span>REBA FILIME</span>
            </button>
            <div className="flex gap-2 mt-6">
              {mobileMovies.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentMobileIndex ? 'w-6 bg-brand-gold' : 'w-2 bg-white/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          DESKTOP VIEW
         ======================= */}
      <div className="hidden md:block w-full pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-3 gap-8 h-[75vh]">
            {desktopMovies.map((movie, index) => (
              <div 
                key={movie.id || index} 
                // 🚀 Added 'will-change-transform' to force GPU usage (smoother animation)
                className="relative w-full h-full rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 will-change-transform
                border border-brand-gold/30
                shadow-[0_0_30px_-5px_rgba(255,215,0,0.3)] 
                hover:shadow-[0_0_60px_-10px_rgba(255,215,0,0.6)]
                hover:-translate-y-2"
                onClick={() => onPlay(movie)}
              >
                <div className="absolute inset-0">
                  <img 
                    // 🚀 Load 'w1280' (Desktop HD) instead of original
                    src={getOptimizedUrl(movie.poster_url || movie.image, false)} 
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100 will-change-transform" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/20 to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                <div className="absolute top-6 right-6 z-20">
                  <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">
                    {getBadge(movie)}
                  </span>
                </div>

                <div className="relative h-full flex flex-col justify-end p-8 z-20 pb-10">
                  <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 leading-[0.9] drop-shadow-xl uppercase transform origin-left transition-transform duration-300 group-hover:scale-105 will-change-transform">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-3 text-gray-400 text-sm font-medium mb-4">
                    <span>{movie.year || '2025'}</span>
                    <span className="w-1 h-1 bg-brand-gold rounded-full"></span>
                    <span className="uppercase tracking-widest text-brand-gold">{movie.genre || 'Action'}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-6 line-clamp-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    {movie.description || "Reba iyi filime isobanuye neza hano kuri Agasobanuye Films."}
                  </p>
                  <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 will-change-transform">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
                      className="bg-brand-gold hover:bg-white hover:text-black text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                    >
                      <Play fill="black" size={16} />
                      <span>REBA FILIME</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Hero;