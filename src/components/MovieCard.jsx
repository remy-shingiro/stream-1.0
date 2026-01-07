// // const MovieCard = ({ movie }) => {
// //   return (
// //     <div className="group relative w-full flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300">
      
// //       {/* 1. Poster Image */}
// //       <div className="relative aspect-[2/3] w-full overflow-hidden">
// //         {/* Support multiple image key names from your JSON */}
// //         <img 
// //           src={movie.poster_url || movie.image || movie.thumbnail_url} 
// //           alt={movie.title} 
// //           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
// //           loading="lazy" 
// //         />
// //         {/* Dark gradient overlay */}
// //         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
// //       </div>

// //       {/* 2. Yellow Bottom Bar */}
// //       {/* CHANGED: 'h-14' to 'min-h-[3.5rem] h-auto' so it grows with text */}
// //       <div className="bg-brand-gold w-full py-3 px-2 flex flex-col items-center justify-center text-center min-h-[3.5rem] h-auto relative z-10">
        
// //         {/* Title */}
// //         <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
// //           {movie.title}
// //         </h3>
        
// //         {/* Interpreter Name */}
// //         {/* We check if the name exists. If not, we don't render anything */}
// //         {movie.interpreter_name && (
// //           <p className="text-black/80 text-[10px] font-extrabold uppercase tracking-wide mt-1 bg-white/20 px-2 rounded-full">
// //             {movie.interpreter_name}
// //           </p>
// //         )}

// //       </div>
      
// //     </div>
// //   );
// // };

// // export default MovieCard;


// const MovieCard = ({ movie }) => {
//   return (
//     // Removed 'cursor-pointer' (handled by Link)
//     <div className="group relative w-full flex flex-col hover:shadow-2xl transition-all duration-300">
      
//       {/* 1. Poster Image */}
//       <div className="relative aspect-[2/3] w-full overflow-hidden">
//         <img 
//           src={movie.poster_url || movie.image || movie.thumbnail_url} 
//           alt={movie.title} 
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//           loading="lazy" 
//         />
//         {/* Dark gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//       </div>

//       {/* 2. Yellow Bottom Bar */}
//       <div className="bg-brand-gold w-full py-3 px-2 flex flex-col items-center justify-center text-center min-h-[3.5rem] h-auto relative z-10">
        
//         {/* Title */}
//         <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
//           {movie.title}
//         </h3>
        
//         {/* Interpreter Name */}
//         {movie.interpreter_name && (
//           <p className="text-black/80 text-[10px] font-extrabold uppercase tracking-wide mt-1 bg-white/20 px-2 rounded-full">
//             {movie.interpreter_name}
//           </p>
//         )}

//       </div>
      
//     </div>
//   );
// };

// export default MovieCard;


import { Play, Layers, Library, Download } from 'lucide-react'; // Make sure to install lucide-react if missing

const MovieCard = ({ movie, onClick }) => {
  
  // --- HELPER LOGIC ---
  const isSeries = movie.type === 'series';
  const isCollection = movie.type === 'collection';
  
  // Calculate count: Seasons for Series, Parts (Episodes) for Collections
  // Note: Collections store parts in seasons[0].episodes
  const count = isSeries 
    ? (movie.seasons?.length || 0) 
    : isCollection 
      ? (movie.seasons?.[0]?.episodes?.length || 0) 
      : 0;

  // Logic: Direct Download is ONLY for single movies
  const showDirectDownload = movie.type === 'movie' && movie.download_url;

  return (
    <div 
      onClick={() => onClick && onClick(movie)} // Triggers the Modal
      className="group relative w-full flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      
      {/* 1. Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        <img 
          src={movie.poster_url || movie.image || movie.thumbnail_url} 
          alt={movie.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
          loading="lazy" 
        />
        
        {/* --- BADGES (Top Right) --- */}
        {/* Shows "3 Seasons" or "5 Parts" */}
        {(isSeries || isCollection) && (
          <div className="absolute top-2 right-2 z-20 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 flex items-center gap-1 shadow-lg">
             {isSeries ? <Layers size={10} className="text-brand-gold" /> : <Library size={10} className="text-red-500" />}
             <span>{count} {isSeries ? 'Seasons' : 'Parts'}</span>
          </div>
        )}

        {/* --- HOVER OVERLAY (Center) --- */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Main Play Button */}
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
            <Play fill="white" size={20} className="ml-1" />
          </div>

          {/* Context Text */}
          <span className="text-white text-xs font-bold tracking-wider drop-shadow-md">
            {isSeries ? 'VIEW EPISODES' : isCollection ? 'VIEW COLLECTION' : 'WATCH NOW'}
          </span>

          {/* Optional: Direct Download (Only for Movies) */}
          {showDirectDownload && (
             <button 
               onClick={(e) => {
                 e.stopPropagation(); // Stop modal from opening
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

      {/* 2. Yellow Bottom Bar (Kept exactly as you like it) */}
      <div className="bg-brand-gold w-full py-3 px-2 flex flex-col items-center justify-center text-center min-h-[3.5rem] h-auto relative z-20">
        
        {/* Title */}
        <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        {/* Interpreter Name */}
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