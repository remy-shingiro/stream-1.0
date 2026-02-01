import { Play } from 'lucide-react'; 

const Hero = ({ movies = [], onPlay }) => {
  if (!movies || movies.length === 0) return null;

  // 1. Data for Mobile (Just the 1st one)
  const mobileMovie = movies[0];

  // 2. Data for Desktop (The top 3 movies)
  const desktopMovies = movies.slice(0, 3);

  // Helper to determine badge text
  const getBadge = (movie) => {
    if (movie.type === 'series') {
      return `Season ${movie.seasons?.length || 1}`;
    }
    if (movie.type === 'collection') {
      return `${movie.seasons?.[0]?.episodes?.length || 1} Parts`;
    }
    return 'HD';
  };

  return (
    <div className="w-full bg-[#0f0f0f]">
      
      {/* =======================================================
          MOBILE VIEW (Phones Only) - Remains 1 Big Image
         ======================================================= */}
      <div className="block md:hidden relative h-[65vh] w-full overflow-hidden group">
        <div className="absolute inset-0">
          <img 
            src={mobileMovie.poster_url || mobileMovie.image} 
            alt={mobileMovie.title}
            loading="eager"
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
        </div>

        <div className="relative h-full flex items-end px-4 pb-10 z-10">
          <div>
            <span className="bg-brand-gold text-black text-[10px] font-bold px-2 py-0.5 rounded mb-3 inline-block uppercase tracking-wider shadow-md">
              #1 Trending
            </span>
            <h1 className="text-4xl font-black mb-4 leading-none text-white drop-shadow-2xl uppercase">
              {mobileMovie.title}
            </h1>
            <button 
              onClick={() => onPlay(mobileMovie)}
              className="bg-brand-gold text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
            >
              <Play fill="black" size={18} />
              <span>REBA FILIME</span>
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================
          DESKTOP VIEW (3 Vertical Columns)
         ======================================================= */}
      <div className="hidden md:grid grid-cols-3 h-[85vh] w-full border-b border-white/5">
        {desktopMovies.map((movie, index) => (
          <div 
            key={movie.id || index} 
            className="relative h-full w-full group overflow-hidden border-r border-white/5 last:border-r-0 cursor-pointer"
            onClick={() => onPlay(movie)}
          >
            
            {/* 1. Background Image (Zooms on Hover) */}
            <div className="absolute inset-0">
              <img 
                src={movie.poster_url || movie.image} 
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100" 
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
              
              {/* Hover Highlight (Lightens the whole col) */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* 2. Top Right Badge (Season/HD) */}
            <div className="absolute top-24 right-6 z-20">
               <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                 {getBadge(movie)}
               </span>
            </div>

            {/* 3. Bottom Content (Slides Up on Hover) */}
            <div className="relative h-full flex flex-col justify-end p-8 z-20 pb-16">
              
              {/* Title */}
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-3 leading-[0.9] drop-shadow-xl uppercase transform origin-left transition-transform duration-300 group-hover:scale-105">
                {movie.title}
              </h2>

              {/* Meta Info (Year | Genre) */}
              <div className="flex items-center gap-3 text-gray-400 text-sm font-medium mb-4">
                 <span>{movie.year || '2025'}</span>
                 <span className="w-1 h-1 bg-brand-gold rounded-full"></span>
                 <span className="uppercase tracking-widest text-brand-gold">{movie.genre || 'Action'}</span>
              </div>

              {/* Description (Fades In) */}
              <p className="text-gray-300 text-sm mb-6 line-clamp-2 max-w-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                {movie.description || "Reba iyi filime isobanuye neza hano kuri Agasobanuye Films."}
              </p>

              {/* Button (Slides Up) */}
              <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                <button 
                  onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
                  className="bg-brand-gold hover:bg-white hover:text-black text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                >
                  <Play fill="black" size={18} />
                  <span>REBA FILIME</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Hero;