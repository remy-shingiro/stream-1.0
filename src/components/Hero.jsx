
import { Play } from 'lucide-react'; // Ensure you have this icon installed

const Hero = ({ movies = [], onPlay }) => {
  // 1. Safety Check: If no movies, show nothing
  if (!movies || movies.length === 0) return null;

  // 2. LOGIC: Just grab the first movie (The Latest Added)
  const latestMovie = movies[0];

  // 3. Helper for download link
  const getDownloadLink = (item) => {
     return item.download_url || item.downloadUrl || item.link || item.url || null;
  };
  const downloadUrl = getDownloadLink(latestMovie);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden group">
      
      {/* BACKGROUND IMAGE (Static & Fast) */}
      <div className="absolute inset-0">
        <img 
          src={latestMovie.poster_url || latestMovie.image} 
          alt={latestMovie.title}
          
          // --- 🚀 THE SPEED OPTIMIZATION ---
          fetchPriority="high"   // Download First
          loading="eager"        // Don't wait
          decoding="sync"        // Paint immediately
          // ---------------------------------

          className="h-full w-full object-cover transition-transform duration-[10000ms] ease-linear transform scale-100 group-hover:scale-110" 
        />
        {/* Dark Overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="max-w-2xl mt-20">
          
          <span className="bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block shadow-lg">
            #1 New Arrival
          </span>
          
          <h1 className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight text-white drop-shadow-2xl">
            {latestMovie.title}
          </h1>
          
          <p className="text-base md:text-lg text-gray-200 mb-8 line-clamp-3 max-w-xl drop-shadow-md">
            {latestMovie.description || "Ntucikwe na filime nziza cyane zigezweho. Reba ubu nonaha kuri Agasobanuye Films."}
          </p>
          
          <div className="flex flex-wrap gap-4">
            {/* Play Button */}
            <button 
              onClick={() => onPlay(latestMovie)}
              className="bg-brand-gold hover:bg-yellow-500 text-black px-8 py-3.5 rounded-sm font-bold transition transform hover:scale-105 flex items-center gap-3 shadow-lg"
            >
              <Play fill="black" size={20} />
              <span>REBA FILIME</span>
            </button>

            {/* Download Button */}
            <a 
              href={downloadUrl || "#"}
              target={downloadUrl ? "_blank" : "_self"}
              onClick={(e) => !downloadUrl && e.preventDefault()}
              className={`
                px-8 py-3.5 rounded-sm font-bold flex items-center gap-3 border transition-all
                ${downloadUrl 
                  ? "bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black" 
                  : "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span className="text-xl font-bold">⬇</span> 
              <span>DOWNLOAD</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;