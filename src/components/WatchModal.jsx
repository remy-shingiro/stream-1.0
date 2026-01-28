import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react'; 
import SEO from './SEO'; // <--- Using the new SEO Engine
import Navbar from './Navbar';

const WatchModal = ({ content, allContent, onClose, onContentChange, onSearch }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    if ((content.type === 'series' || content.type === 'collection') && content.seasons?.[0]?.episodes?.length > 0) {
      setCurrentEpisode(content.seasons[0].episodes[0]);
    } else {
      setCurrentEpisode(null);
    }
  }, [content]);

  const recommendations = allContent
    .filter((item) => item.id !== content.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const isCollection = content.type === 'collection';
  const isSeries = content.type === 'series';

  // --- LOGIC: Determine Active Video & Image ---
  const activeVideoUrl = (isSeries || isCollection)
    ? (currentEpisode?.link || currentEpisode?.video_url || currentEpisode?.videoUrl) 
    : (content.video_url || content.videoUrl || content.link);

  const getDownloadLink = (item) => {
    if (!item) return null;
    return item.downloadLink || item.download_url || item.downloadUrl || null;
  };

  const activeDownloadUrl = (isSeries || isCollection)
    ? getDownloadLink(currentEpisode)
    : getDownloadLink(content);

  // --- LOGIC: Active Title for UI ---
  let activeTitle = "Movie";
  if (isSeries && currentEpisode) {
    const sIdx = content.seasons.findIndex(s => s.episodes.includes(currentEpisode));
    activeTitle = `S${sIdx + 1}:E${currentEpisode.episodeNumber || 1}`;
  } else if (isCollection && currentEpisode) {
    const partIdx = content.seasons[0].episodes.indexOf(currentEpisode);
    activeTitle = `Part ${partIdx + 1}`;
  }

  // --- NEW SEO PREPARATION (The Traffic Controller) ---
  // 1. Calculate the exact title Google should see
  const seoTitle = (isSeries || isCollection) && currentEpisode
    ? `${content.title} - ${currentEpisode.title || activeTitle}`
    : content.title;
  
  // 2. Calculate the exact image WhatsApp should show
  const seoImage = (isSeries && currentEpisode?.image) 
    ? currentEpisode.image 
    : (content.poster_url || content.image);

  // 3. Get file size for the "Click Bait" title (fallback to empty if missing)
  const seoSize = content.size || content.sizeMB || ""; 

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">

      {/* --- INJECT THE NEW SEO ENGINE --- */}
      {/* This automatically updates Google & WhatsApp when you switch episodes */}
      <SEO 
        title={`${seoTitle} - Agasobanuye ${content.interpreter || ''}`} 
        description={content.description || `Reba ${seoTitle} yasobanuwe na ${content.interpreter}. Genre: ${content.genre}.`} 
        image={seoImage}
        url={`https://agasobanuyefilime.com/watch/${content.id}`}
        // Programmatic Data
        genre={content.genre || "Agasobanuye"}
        interpreter={content.interpreter || "Vj"}
        uploadDate={content.created_at || new Date().toISOString()}
      />

      {/* ——— NAVBAR SECTION ——— */}
      <div className="relative z-50 w-full">
         <Navbar 
            onSearch={(query) => { if (onSearch) onSearch(query); }}
            data={allContent}
            onItemClick={(movie) => { onContentChange(movie); }} 
         />
      </div>

      <div className="w-full max-w-7xl h-full md:h-[90vh] bg-[#121212] md:rounded-xl shadow-2xl flex flex-col overflow-hidden border-none md:border border-white/10 mx-auto md:my-auto">
        
        {/* --- HEADER --- */}
        <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-white/10 z-20">
          <div className="flex flex-col overflow-hidden mr-2 min-w-0">
              <h2 className="text-white text-sm md:text-lg font-bold truncate">
                {content.title}
              </h2>
              <span className="text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                {activeTitle}
              </span>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeDownloadUrl && (
              <a 
                href={activeDownloadUrl} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => !activeDownloadUrl && e.preventDefault()} 
                className="flex items-center justify-center gap-2 flex-shrink-0 min-w-fit bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wide rounded-full shadow-lg shadow-green-900/40 border border-green-400/30 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap text-[10px] px-3 py-1.5 sm:text-xs sm:px-4 sm:py-2"
              >
                  <Download size={14} strokeWidth={3} />
                  <span>Download {seoSize ? `(${seoSize})` : ''}</span>
              </a>
            )}

            <button 
              onClick={onClose} 
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-600 text-white transition-colors backdrop-blur-md ml-1 flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT: VIDEO PLAYER */}
          <div className="w-full md:flex-1 flex flex-col bg-black md:overflow-y-auto shrink-0">
            <div className="w-full aspect-video md:h-auto md:flex-1 lg:flex-none lg:aspect-video bg-black flex items-center justify-center flex-shrink-0 relative">
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
                  <p className="font-bold mb-2">Video NTAGO IHARI</p>
                </div>
              )}
            </div>
            
            <div className="hidden lg:block p-6">
              <h3 className="text-white font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {content.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT: LIST */}
          <div className="flex-1 md:flex-none w-full md:w-80 bg-[#181818] md:border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-gray-900/50 flex-shrink-0">
               <h3 className="text-gray-400 text-xs font-bold uppercase">
                 {isSeries ? 'Episodes' : isCollection ? 'Movies in Collection' : 'Related Movies'}
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
               {isSeries ? (
                 content.seasons?.map((season, sIdx) => (
                   <div key={sIdx} className="mb-2">
                     <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase sticky top-0 bg-[#181818]">Season {season.seasonNumber}</div>
                     {season.episodes.map((ep, eIdx) => (
                       <button 
                         key={eIdx}
                         onClick={() => setCurrentEpisode(ep)}
                         className={`w-full text-left p-3 rounded text-sm truncate transition-colors mb-1 ${currentEpisode === ep ? 'bg-brand-gold text-black font-bold' : 'bg-[#222] text-gray-300 hover:bg-white/10'}`}
                       >
                         <span className="opacity-60 mr-2 text-xs">Ep {ep.episodeNumber || eIdx + 1}</span>{ep.title}
                       </button>
                     ))}
                   </div>
                 ))
               ) : isCollection ? (
                 content.seasons?.[0]?.episodes.map((part, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentEpisode(part)}
                      className={`w-full text-left p-3 rounded text-sm truncate transition-colors mb-1 flex items-center gap-3 ${currentEpisode === part ? 'bg-red-600 text-white font-bold shadow-lg' : 'bg-[#222] text-gray-300 hover:bg-white/10'}`}
                    >
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${currentEpisode === part ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'}`}>IGICE {idx + 1}</span>
                      <span className="truncate">{part.title}</span>
                    </button>
                 ))
               ) : (
                 recommendations.map(rec => (
                   <div key={rec.id} onClick={() => onContentChange && onContentChange(rec)} className="flex gap-3 p-2 hover:bg-white/10 rounded cursor-pointer transition-colors bg-[#222] md:bg-transparent">
                     <img src={rec.poster_url || rec.image} className="w-16 h-24 object-cover rounded shadow-md flex-shrink-0" alt={rec.title} />
                     <div className="flex flex-col justify-center min-w-0">
                       <p className="text-gray-200 text-sm font-medium line-clamp-2 leading-snug">{rec.title}</p>
                       <p className="text-xs text-brand-gold mt-1">REBA NIYI ▶</p>
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