import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react'; 

const Hero = ({ movies = [], onPlay }) => {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const movieIds = movies.map(m => m.id).join(',');
  // 🚀 SENIOR FIX 1: Bulletproof Shuffle State
  // This guarantees we only shuffle ONCE. It prevents React from 
  // silently re-shuffling and breaking the loop if parent states change.
  useEffect(() => {
    if (movies && movies.length > 0) {
      const shuffled = [...movies];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setDeck(shuffled);
      setCurrentIndex(0); // Reset the loop to the beginning when fresh data arrives
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieIds]);

  // 🚀 THE BULLETPROOF TIMER
  useEffect(() => {
    if (deck.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 3500); 
    
    return () => clearInterval(timer);
  }, [deck.length]);

  if (deck.length === 0) return null;

  const currentMovie = deck[currentIndex];
  
  const desktopMovies = [
    deck[currentIndex],
    deck[(currentIndex + 1) % deck.length],
    deck[(currentIndex + 2) % deck.length]
  ];

  const getOptimizedUrl = (url, isMobile = false) => {
    if (!url) return '/placeholder.jpg';
    if (url.includes('sddefault')) return url.replace('sddefault', 'maxresdefault');
    if (url.includes('/w300/') || url.includes('/w500/') || url.includes('/w780/')) {
       const targetSize = isMobile ? 'w780' : 'w1280';
       return url.replace(/\/w[0-9]+\//, `/${targetSize}/`);
    }
    if (url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', isMobile ? '/upload/c_scale,w_800,q_auto,f_auto/' : '/upload/c_scale,w_1200,q_auto,f_auto/');
    }
    return url;
  };

  const getBadge = (movie) => {
    if (movie.type === 'series') return `Season ${movie.seasons?.length || 1}`;
    if (movie.type === 'collection') return `${movie.seasons?.[0]?.episodes?.length || 1} Parts`;
    return 'HD';
  };

  const getMetaInfo = (movie) => {
    const year = movie.year || (movie.release_date ? movie.release_date.substring(0, 4) : null);
    const category = movie.category || movie.genre || (movie.type === 'series' ? 'Series' : 'Movie');
    return { year, category };
  };

  return (
    <div className="w-full bg-slate-950">
      
      {/* =======================
          MOBILE VIEW
          ======================= */}
      <div className="block md:hidden w-full px-4 pt-6 pb-6">
        <div key={currentIndex} className="relative h-[55vh] w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-500 bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img 
              src={getOptimizedUrl(currentMovie.poster_url || currentMovie.image, true)}
              alt={currentMovie.title}
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
              className="h-full w-full object-cover transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          </div>

          <div className="absolute top-4 right-4 z-20">
             <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
               {getBadge(currentMovie)}
             </span>
          </div>

          {/* 🚀 SENIOR FIX 2: Strict left-alignment and massive size reduction */}
          <div className="relative h-full flex flex-col justify-end items-start px-5 pb-8 z-10 text-white text-left">
             
             <h1 className="text-lg font-black mb-1 uppercase leading-tight tracking-wide text-white drop-shadow-lg line-clamp-2">
               {currentMovie.title}
             </h1>
             
             <div className="flex items-center gap-1.5 text-gray-300 text-[10px] font-bold mb-3 drop-shadow-md uppercase tracking-wider">
                {getMetaInfo(currentMovie).year && (
                  <>
                    <span>{getMetaInfo(currentMovie).year}</span>
                    <span className="w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_5px_rgba(251,191,36,0.8)]"></span>
                  </>
                )}
                <span className="text-amber-400">{getMetaInfo(currentMovie).category}</span>
             </div>

             <button onClick={() => onPlay(currentMovie)} className="bg-amber-400 text-black px-4 py-2 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-transform w-fit text-[11px]">
               <Play fill="black" size={12} />
               <span>REBA FILIME</span>
             </button>
             
             <div className="flex gap-1.5 mt-6 w-full justify-start">
               {[0, 1, 2, 3, 4].map((idx) => (
                 <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === (currentIndex % 5) ? 'w-5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'w-1.5 bg-white/30'}`} />
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
          <div className="grid grid-cols-3 gap-6 h-[50vh]">
            {desktopMovies.map((movie, index) => (
              <div 
                // Using currentIndex forces a clean crossfade animation every time it shifts
                key={`${currentIndex}-${index}`} 
                className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-slate-900 transition-all duration-500 animate-in fade-in zoom-in-95 hover:shadow-[0_0_40px_-10px_rgba(255,215,0,0.3)]"
                onClick={() => onPlay(movie)}
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={getOptimizedUrl(movie.poster_url || movie.image, false)}
                    alt={movie.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
                    className="h-full w-full object-cover transition-all duration-700 ease-out" 
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="absolute top-6 right-6 z-20">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded border border-white/10 uppercase drop-shadow-md">
                    {getBadge(movie)}
                  </span>
                </div>

                {/* 🚀 SENIOR FIX 2: Desktop Layout strict left-alignment and text scale down */}
                <div className="relative h-full flex flex-col justify-end items-start p-6 z-20 text-left">
                  
                  <h2 className="text-xl font-black mb-1 uppercase leading-tight tracking-wide text-white drop-shadow-lg line-clamp-2">
                    {movie.title}
                  </h2>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-bold mb-3 uppercase tracking-widest drop-shadow-md text-gray-300">
                    {getMetaInfo(movie).year && (
                       <>
                         <span>{getMetaInfo(movie).year}</span>
                         <span className="w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_5px_rgba(251,191,36,0.8)]"></span>
                       </>
                    )}
                    <span className="text-amber-400">{getMetaInfo(movie).category}</span>
                  </div>
                  
                  <button className="flex items-center gap-1.5 bg-amber-400 text-black px-4 py-2 rounded-full font-bold w-fit hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,215,0,0.4)] text-[11px]">
                    <Play fill="black" size={12} />
                    <span>REBA FILIME</span>
                  </button>
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