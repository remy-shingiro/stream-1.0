import { Play, Layers, Library, Download } from 'lucide-react';

// 1. ADD 'index' PROP HERE
const MovieCard = ({ movie, onClick, index }) => {
  
  // --- HELPER LOGIC ---
  const isSeries = movie.type === 'series';
  const isCollection = movie.type === 'collection';
  
  const count = isSeries 
    ? (movie.seasons?.length || 0) 
    : isCollection 
      ? (movie.seasons?.[0]?.episodes?.length || 0) 
      : 0;

  const showDirectDownload = movie.type === 'movie' && movie.download_url;

  // 2. SPEED LOGIC: Is this one of the first 2 images on the screen?
  // If yes, we want it FAST. If no, we want it LAZY.
  const isPriority = index < 2;

  return (
    <div 
      onClick={() => onClick && onClick(movie)} 
      className="group relative w-full flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform-gpu"
    >
      
      {/* 1. Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900 rounded-t-lg">
        <img 
          src={movie.poster_url || movie.image || movie.thumbnail_url} 
          alt={movie.title} 
          
          // 3. THE FIX: Dynamic Speed Settings
          // If priority, load EAGER (now) and HIGH priority.
          // If not, load LAZY and LOW priority.
          loading={isPriority ? "eager" : "lazy"}
          fetchPriority={isPriority ? "high" : "low"}
          decoding="async"
          
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
        />
        
        {/* --- BADGES (Kept same) --- */}
        {(isSeries || isCollection) && (
          <div className="absolute top-2 right-2 z-20 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 flex items-center gap-1 shadow-lg">
             {isSeries ? <Layers size={10} className="text-brand-gold" /> : <Library size={10} className="text-red-500" />}
             <span>{count} {isSeries ? 'Seasons' : 'Parts'}</span>
          </div>
        )}

        {/* --- HOVER OVERLAY (Kept same) --- */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
            <Play fill="white" size={20} className="ml-1" />
          </div>

          <span className="text-white text-xs font-bold tracking-wider drop-shadow-md">
            {isSeries ? 'VIEW EPISODES' : isCollection ? 'VIEW COLLECTION' : 'WATCH NOW'}
          </span>

          {showDirectDownload && (
             <button 
               onClick={(e) => {
                 e.stopPropagation(); 
                 window.open(movie.download_url, '_blank');
               }}
               className="mt-2 flex items-center gap-1 bg-white/20 hover:bg-white/40 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm transition-colors border border-white/30"
             >
               <Download size={10} />
               <span>Fast DL</span>
             </button>
          )}
        </div>
      </div>

      {/* 2. Yellow Bottom Bar (Layout Fix) */}
      {/* Changed h-auto to h-[4rem] so all cards are perfectly equal */}
      <div className="bg-brand-gold w-full py-3 px-2 flex flex-col items-center justify-center text-center h-[4rem] relative z-20 rounded-b-lg">
        
        <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        {movie.interpreter_name && (
          <p className="text-black/80 text-[10px] font-extrabold uppercase tracking-wide mt-1 bg-white/20 px-2 rounded-full">
            {movie.interpreter_name}
          </p>
        )}

      </div>
      
    </div>
  );
};

export default MovieCard;