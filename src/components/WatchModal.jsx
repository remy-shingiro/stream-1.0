// import { useState, useEffect } from 'react';
// import SEO from './SEO'; 
// import useStructuredData from '../hooks/useStructuredData';

// const WatchModal = ({ content, allContent, onClose, onContentChange }) => {
//   const [currentEpisode, setCurrentEpisode] = useState(null);

//   // --- 1. Initialize Series Logic ---
//   useEffect(() => {
//     // If it's a series, automatically select S1:E1
//     if (content.type === 'series' && content.seasons?.[0]?.episodes?.length > 0) {
//       setCurrentEpisode(content.seasons[0].episodes[0]);
//     } else {
//       setCurrentEpisode(null);
//     }
//   }, [content]);

//   // --- 2. Recommendations Logic ---
//   const recommendations = allContent
//     .filter((item) => item.id !== content.id)
//     .sort(() => 0.5 - Math.random())
//     .slice(0, 4);

//   // --- 3. Smart Link Resolvers (Fixes Admin Panel Mismatch) ---
  
//   // Gets the video stream URL
//   const activeVideoUrl = content.type === 'series' 
//     ? (currentEpisode?.link || currentEpisode?.video_url || currentEpisode?.videoUrl) 
//     : (content.video_url || content.videoUrl || content.link);

//   // Gets the download URL
//   const getDownloadLink = (item) => {
//     if (!item) return null;
//     return item.downloadLink || item.download_url || item.downloadUrl || null;
//   };

//   const activeDownloadUrl = content.type === 'series' 
//     ? getDownloadLink(currentEpisode)
//     : getDownloadLink(content);

//   // Generates the display title (e.g. "S1:E1 Episode Name")
//   const activeTitle = content.type === 'series' && currentEpisode 
//     ? `S${content.seasons.findIndex(s => s.episodes.includes(currentEpisode)) + 1}:E${currentEpisode.episodeNumber || 1}`
//     : "Movie";

//   // --- 4. SEO & Structured Data ---
//   const isSeries = content.type === 'series';
  
//   const schemaData = isSeries && currentEpisode ? {
//     "@context": "https://schema.org",
//     "@type": "TVEpisode",
//     "name": currentEpisode.title || content.title,
//     "partOfSeries": {
//       "@type": "TVSeries",
//       "name": content.title
//     },
//     "episodeNumber": currentEpisode.episodeNumber || "1",
//     "description": content.description,
//     "image": content.poster_url || content.image,
//     "duration": "PT45M"
//   } : {
//     "@context": "https://schema.org",
//     "@type": "Movie",
//     "name": content.title,
//     "description": content.description,
//     "image": content.poster_url || content.image,
//     "aggregateRating": {
//       "@type": "AggregateRating",
//       "ratingValue": "4.8",
//       "ratingCount": "1024",
//       "bestRating": "5",
//       "worstRating": "1"
//     },
//     "offers": {
//       "@type": "Offer",
//       "availability": "https://schema.org/InStock",
//       "price": "0",
//       "priceCurrency": "RWF"
//     }
//   };

//   useStructuredData(schemaData);

//   return (
//     // OUTER WRAPPER
//     <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 md:p-4">
      
//       <SEO 
//         key={content.id}
//         title={isSeries ? `${content.title} - ${currentEpisode?.title || 'Watch'}` : content.title} 
//         description={content.description || `Watch ${content.title} on StreamIt.`} 
//       />

//       {/* MAIN CONTAINER */}
//       <div className="w-full max-w-7xl h-full md:h-[90vh] bg-[#121212] md:rounded-xl shadow-2xl flex flex-col overflow-hidden border-none md:border border-white/10">
        
//         {/* --- HEADER --- */}
//         <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-white/10 z-20">
//           <div className="flex flex-col overflow-hidden">
//              <h2 className="text-white text-base md:text-lg font-bold truncate max-w-[150px] md:max-w-md">
//                 {content.title}
//              </h2>
//              <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">
//                {activeTitle}
//              </span>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <a 
//               href={activeDownloadUrl || "#"} 
//               target={activeDownloadUrl ? "_blank" : "_self"}
//               onClick={(e) => !activeDownloadUrl && e.preventDefault()} 
//               className={`
//                 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all
//                 ${activeDownloadUrl 
//                   ? "bg-white text-black hover:bg-brand-gold" 
//                   : "bg-gray-800 text-gray-500 cursor-not-allowed" 
//                 }
//               `}
//             >
//                <span className="hidden sm:inline">{activeDownloadUrl ? "Download" : "No Link"}</span>
//                <span className="sm:hidden">{activeDownloadUrl ? "⬇" : "🚫"}</span>
//             </a>

//             <button 
//               onClick={onClose} 
//               className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         {/* --- BODY CONTENT --- */}
//         <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
//           {/* LEFT SIDE: VIDEO PLAYER */}
//           <div className="w-full md:flex-1 flex flex-col bg-black md:overflow-y-auto shrink-0">
            
//             {/* VIDEO CONTAINER */}
//             <div className="w-full h-[65vh] md:h-auto md:flex-1 lg:flex-none lg:aspect-video bg-black flex items-center justify-center flex-shrink-0 relative">
//                {activeVideoUrl ? (
//                 <iframe 
//                   src={activeVideoUrl} 
//                   className="w-full h-full" 
//                   frameBorder="0" 
//                   allowFullScreen
//                   title="Video Player"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 ></iframe>
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#0f0f0f]">
//                   <p className="font-bold mb-2">Video Unavailable</p>
//                   <p className="text-xs opacity-60">Try selecting a different episode or server.</p>
//                 </div>
//               )}
//             </div>
            
//             {/* DESCRIPTION: Visible ONLY on Large Screens (Desktop) */}
//             <div className="hidden lg:block p-6">
//               <h3 className="text-white font-bold text-lg mb-2">Description</h3>
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 {content.description || "No description provided."}
//               </p>
//             </div>
//           </div>

//           {/* RIGHT SIDE: SIDEBAR LIST */}
//           <div className="flex-1 md:flex-none w-full md:w-80 bg-[#181818] md:border-l border-white/5 flex flex-col overflow-hidden">
//             <div className="p-3 border-b border-white/5 bg-gray-900/50 flex-shrink-0">
//                <h3 className="text-gray-400 text-xs font-bold uppercase">
//                  {content.type === 'series' ? 'Seasons & Episodes' : 'Related'}
//                </h3>
//             </div>
            
//             <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
//                {content.type === 'series' ? (
//                  // --- SERIES LIST LOGIC ---
//                  content.seasons?.map((season, sIdx) => (
//                    <div key={sIdx} className="mb-2">
//                      <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase sticky top-0 bg-[#181818]">
//                         Season {season.seasonNumber}
//                      </div>
//                      {season.episodes.map((ep, eIdx) => (
//                        <button 
//                          key={eIdx} // Fallback to index if no ID
//                          onClick={() => setCurrentEpisode(ep)}
//                          className={`w-full text-left p-3 rounded text-sm truncate transition-colors mb-1 ${
//                            currentEpisode === ep 
//                              ? 'bg-brand-gold text-black font-bold' 
//                              : 'bg-[#222] text-gray-300 hover:bg-white/10'
//                          }`}
//                        >
//                          <span className="opacity-60 mr-2 text-xs">Ep {ep.episodeNumber || eIdx + 1}</span>
//                          {ep.title}
//                        </button>
//                      ))}
//                    </div>
//                  ))
//                ) : (
//                  // --- RELATED MOVIES LOGIC ---
//                  recommendations.map(rec => (
//                    <div 
//                      key={rec.id} 
//                      onClick={() => onContentChange && onContentChange(rec)}
//                      className="flex gap-3 p-2 hover:bg-white/10 rounded cursor-pointer transition-colors bg-[#222] md:bg-transparent"
//                    >
//                      <img 
//                        src={rec.poster_url || rec.image} 
//                        className="w-16 h-24 object-cover rounded shadow-md flex-shrink-0" 
//                        alt={rec.title}
//                      />
//                      <div className="flex flex-col justify-center min-w-0">
//                        <p className="text-gray-200 text-sm font-medium line-clamp-2 leading-snug">{rec.title}</p>
//                        <p className="text-xs text-brand-gold mt-1">Watch Now ▶</p>
//                      </div>
//                    </div>
//                  ))
//                )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default WatchModal;



import { useState, useEffect } from 'react';
import SEO from './SEO'; 
import useStructuredData from '../hooks/useStructuredData';

const WatchModal = ({ content, allContent, onClose, onContentChange }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // --- 1. Initialize Series & Collection Logic ---
  useEffect(() => {
    // If it's a series OR a collection, automatically select the first item (S1:E1 or Part 1)
    if ((content.type === 'series' || content.type === 'collection') && content.seasons?.[0]?.episodes?.length > 0) {
      setCurrentEpisode(content.seasons[0].episodes[0]);
    } else {
      setCurrentEpisode(null);
    }
  }, [content]);

  // --- 2. Recommendations Logic ---
  const recommendations = allContent
    .filter((item) => item.id !== content.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  // --- 3. Smart Link Resolvers ---
  
  const isCollection = content.type === 'collection';
  const isSeries = content.type === 'series';

  // Gets the video stream URL
  const activeVideoUrl = (isSeries || isCollection)
    ? (currentEpisode?.link || currentEpisode?.video_url || currentEpisode?.videoUrl) 
    : (content.video_url || content.videoUrl || content.link);

  // Gets the download URL
  const getDownloadLink = (item) => {
    if (!item) return null;
    return item.downloadLink || item.download_url || item.downloadUrl || null;
  };

  const activeDownloadUrl = (isSeries || isCollection)
    ? getDownloadLink(currentEpisode)
    : getDownloadLink(content);

  // Generates the display title
  let activeTitle = "Movie";
  if (isSeries && currentEpisode) {
    const sIdx = content.seasons.findIndex(s => s.episodes.includes(currentEpisode));
    activeTitle = `S${sIdx + 1}:E${currentEpisode.episodeNumber || 1}`;
  } else if (isCollection && currentEpisode) {
    const partIdx = content.seasons[0].episodes.indexOf(currentEpisode);
    activeTitle = `Part ${partIdx + 1}`;
  }

  // --- 4. SEO & Structured Data ---
  const schemaData = (isSeries || isCollection) && currentEpisode ? {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    "name": currentEpisode.title || content.title,
    "partOfSeries": {
      "@type": "TVSeries",
      "name": content.title
    },
    "episodeNumber": currentEpisode.episodeNumber || "1",
    "description": content.description,
    "image": content.poster_url || content.image,
    "duration": "PT45M"
  } : {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": content.title,
    "description": content.description,
    "image": content.poster_url || content.image,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1024",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "RWF"
    }
  };

  useStructuredData(schemaData);

  return (
    // OUTER WRAPPER
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 md:p-4">
      
      <SEO 
        key={content.id}
        title={isSeries || isCollection ? `${content.title} - ${currentEpisode?.title || 'Watch'}` : content.title} 
        description={content.description || `Watch ${content.title} on StreamIt.`} 
      />

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-7xl h-full md:h-[90vh] bg-[#121212] md:rounded-xl shadow-2xl flex flex-col overflow-hidden border-none md:border border-white/10">
        
        {/* --- HEADER --- */}
        <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-white/10 z-20">
          <div className="flex flex-col overflow-hidden">
             <h2 className="text-white text-base md:text-lg font-bold truncate max-w-[150px] md:max-w-md">
                {content.title}
             </h2>
             <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">
               {activeTitle}
             </span>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={activeDownloadUrl || "#"} 
              target={activeDownloadUrl ? "_blank" : "_self"}
              onClick={(e) => !activeDownloadUrl && e.preventDefault()} 
              className={`
                flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all
                ${activeDownloadUrl 
                  ? "bg-white text-black hover:bg-brand-gold" 
                  : "bg-gray-800 text-gray-500 cursor-not-allowed" 
                }
              `}
            >
               <span className="hidden sm:inline">{activeDownloadUrl ? "Download" : "No Link"}</span>
               <span className="sm:hidden">{activeDownloadUrl ? "⬇" : "🚫"}</span>
            </a>

            <button 
              onClick={onClose} 
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* --- BODY CONTENT --- */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT SIDE: VIDEO PLAYER */}
          <div className="w-full md:flex-1 flex flex-col bg-black md:overflow-y-auto shrink-0">
            
            {/* VIDEO CONTAINER */}
            <div className="w-full h-[65vh] md:h-auto md:flex-1 lg:flex-none lg:aspect-video bg-black flex items-center justify-center flex-shrink-0 relative">
               {activeVideoUrl ? (
                <iframe 
                  src={activeVideoUrl} 
                  className="w-full h-full" 
                  frameBorder="0" 
                  allowFullScreen
                  title="Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#0f0f0f]">
                  <p className="font-bold mb-2">Video Unavailable</p>
                  <p className="text-xs opacity-60">Try selecting a different part or server.</p>
                </div>
              )}
            </div>
            
            {/* DESCRIPTION: Visible ONLY on Large Screens (Desktop) */}
            <div className="hidden lg:block p-6">
              <h3 className="text-white font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {content.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: SIDEBAR LIST */}
          <div className="flex-1 md:flex-none w-full md:w-80 bg-[#181818] md:border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-gray-900/50 flex-shrink-0">
               <h3 className="text-gray-400 text-xs font-bold uppercase">
                 {/* DYNAMIC HEADER */}
                 {isSeries ? 'Seasons & Episodes' : 
                  isCollection ? 'Movies in Collection' : 'Related Movies'}
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
               {isSeries ? (
                 // --- SERIES LOGIC ---
                 content.seasons?.map((season, sIdx) => (
                   <div key={sIdx} className="mb-2">
                     <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase sticky top-0 bg-[#181818]">
                        Season {season.seasonNumber}
                     </div>
                     {season.episodes.map((ep, eIdx) => (
                       <button 
                         key={eIdx}
                         onClick={() => setCurrentEpisode(ep)}
                         className={`w-full text-left p-3 rounded text-sm truncate transition-colors mb-1 ${
                           currentEpisode === ep 
                             ? 'bg-brand-gold text-black font-bold' 
                             : 'bg-[#222] text-gray-300 hover:bg-white/10'
                         }`}
                       >
                         <span className="opacity-60 mr-2 text-xs">Ep {ep.episodeNumber || eIdx + 1}</span>
                         {ep.title}
                       </button>
                     ))}
                   </div>
                 ))
               ) : isCollection ? (
                 // --- COLLECTION LOGIC (The New Part) ---
                 // We access the hidden "Season 1" (index 0) to get the list of movies
                 content.seasons?.[0]?.episodes.map((part, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentEpisode(part)}
                      className={`w-full text-left p-3 rounded text-sm truncate transition-colors mb-1 flex items-center gap-3 ${
                        currentEpisode === part 
                          ? 'bg-red-600 text-white font-bold shadow-lg' 
                          : 'bg-[#222] text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {/* Part Badge */}
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        currentEpisode === part ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
                      }`}>
                        Part {idx + 1}
                      </span>
                      
                      {/* Movie Title */}
                      <span className="truncate">{part.title}</span>
                    </button>
                 ))
               ) : (
                 // --- RELATED MOVIES LOGIC ---
                 recommendations.map(rec => (
                   <div 
                     key={rec.id} 
                     onClick={() => onContentChange && onContentChange(rec)}
                     className="flex gap-3 p-2 hover:bg-white/10 rounded cursor-pointer transition-colors bg-[#222] md:bg-transparent"
                   >
                     <img 
                       src={rec.poster_url || rec.image} 
                       className="w-16 h-24 object-cover rounded shadow-md flex-shrink-0" 
                       alt={rec.title}
                     />
                     <div className="flex flex-col justify-center min-w-0">
                       <p className="text-gray-200 text-sm font-medium line-clamp-2 leading-snug">{rec.title}</p>
                       <p className="text-xs text-brand-gold mt-1">Watch Now ▶</p>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchModal;