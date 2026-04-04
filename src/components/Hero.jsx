import React, { useState, useEffect, useMemo } from 'react';
import { Play } from 'lucide-react'; 

const Hero = ({ movies = [], onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // =========================================
  // SPEED OPTIMIZATION 1: "The Endless Deck"
  // We shuffle the ENTIRE database once.
  // =========================================
  const randomizedMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    
    const shuffled = [...movies];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Notice we removed .slice(0, 5)! We keep the whole deck.
    return shuffled;
  }, [movies]);

  // =========================================
  // THE 3-SECOND CAROUSEL TIMER
  // =========================================
  useEffect(() => {
    if (randomizedMovies.length === 0) return;
    
    // Changes the movies every 3.5 seconds (3500ms is a great sweet spot for reading)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % randomizedMovies.length);
    }, 3500); 
    
    return () => clearInterval(timer);
  }, [randomizedMovies.length]);

  if (randomizedMovies.length === 0) return null;

  // --- Carousel Logic ---
  // Mobile gets 1 movie. Desktop gets 3 movies in a row.
  const currentMovie = randomizedMovies[currentIndex];
  
  const desktopMovies = [
    randomizedMovies[currentIndex],
    randomizedMovies[(currentIndex + 1) % randomizedMovies.length],
    randomizedMovies[(currentIndex + 2) % randomizedMovies.length]
  ];

  // --- 🚀 PERFORMANCE FIX: SMART IMAGE RESIZING ---
  const getOptimizedUrl = (url, isMobile = false) => {
    if (!url) return '';
    if (url.includes('sddefault')) return url.replace('sddefault', 'maxresdefault');
    
    if (url.includes('/w300/') || url.includes('/w500/') || url.includes('/w780/')) {
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
        <div key={currentMovie.id || currentIndex} className="relative h-[65vh] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in duration-700 group">
          <div className="absolute inset-0 z-0">
            <div 
              style={{
                backgroundImage: `url(${getOptimizedUrl(currentMovie.poster_url || currentMovie.image, true)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="h-full w-full transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
          </div>

          <div className="absolute top-4 right-4 z-20">
             <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
               {getBadge(currentMovie)}
             </span>
          </div>

          <div className="relative h-full flex flex-col justify-end px-5 pb-8 z-10 text-white">
             <h1 className="text-3xl font-black mb-3 uppercase leading-none drop-shadow-lg">{currentMovie.title}</h1>
             <div className="flex items-center gap-2 text-gray-200 text-xs font-bold mb-4 drop-shadow-md">
                <span>{currentMovie.year || '2025'}</span>
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span className="uppercase text-amber-400">{currentMovie.genre || 'Action'}</span>
             </div>
             <button onClick={() => onPlay(currentMovie)} className="bg-amber-400 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform w-fit">
               <Play fill="black" size={18} />
               <span>REBA FILIME</span>
             </button>
             
             {/* Dynamic Dots: Always shows 5 dots, cycling endlessly */}
             <div className="flex gap-2 mt-6">
               {[0, 1, 2, 3, 4].map((idx) => (
                 <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === (currentIndex % 5) ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'}`} />
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
          <div className="grid grid-cols-3 gap-6 h-[70vh]">
            {desktopMovies.map((movie, index) => (
              <div 
                // We use movie.id as the key so React animates the card swap perfectly!
                key={movie.id || `${currentIndex}-${index}`} 
                className="relative w-full h-full rounded-3xl overflow-hidden group cursor-pointer border border-white/10 bg-slate-900 transition-all duration-700 animate-in fade-in zoom-in-95 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(255,215,0,0.3)]"
                onClick={() => onPlay(movie)}
              >
                <div className="absolute inset-0 z-0">
                  <div 
                    style={{
                      backgroundImage: `url(${getOptimizedUrl(movie.poster_url || movie.image, false)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top', 
                    }}
                    className="h-full w-full group-hover:scale-105 transition-all duration-700 ease-out" 
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
                </div>

                <div className="absolute top-6 right-6 z-20">
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded border border-white/10 uppercase drop-shadow-md">
                    {getBadge(movie)}
                  </span>
                </div>

                <div className="relative h-full flex flex-col justify-end p-8 z-20">
                  <h2 className="text-3xl font-black text-white mb-2 leading-none uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] line-clamp-2">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-4 uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <span className="text-white">{movie.year || '2025'}</span>
                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                    <span>{movie.genre || 'Action'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-amber-400 text-black px-5 py-2.5 rounded-full font-bold w-fit hover:bg-white transition-colors shadow-lg">
                    <Play fill="black" size={16} />
                    <span className="text-sm">REBA FILIME</span>
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

export default React.memo(Hero);