import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Info, Play, MessageSquare, 
  AlertTriangle, ChevronDown, ChevronUp, Zap, Download 
} from 'lucide-react';

const WatchPage = ({ allMovies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(false);

  // 1. Find the current series or movie
  const movie = useMemo(() => 
    allMovies.find(m => m.id.toString() === id.toString()), 
  [allMovies, id]);

  const isSeriesOrCollection = movie?.type === 'series' || movie?.type === 'collection';
  const episodes = isSeriesOrCollection ? (movie.seasons?.[0]?.episodes || []) : [];
  
  const queryParams = new URLSearchParams(location.search);
  const currentEpIndex = parseInt(queryParams.get('ep')) || 0;

  // Link for the current active part
  const currentEpisode = isSeriesOrCollection ? episodes[currentEpIndex] : movie;
  const activeVideoUrl = isSeriesOrCollection ? currentEpisode?.link : (movie?.video_url || movie?.url);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, currentEpIndex]);

  // --- THE TAB FLIP LOGIC (Applied to Watch & Download) ---
  const handleActionTrigger = (targetUrl) => {
    const adUrl = "https://omg10.com/4/10484905"; 

    if (!targetUrl) return;

    // 1. Open the Content/Download in a NEW tab
    const newWindow = window.open(targetUrl, '_blank');

    if (newWindow) {
      newWindow.focus();
      
      // 2. Flip this CURRENT "old" tab into the Ad
      setTimeout(() => {
        window.location.assign(adUrl);
      }, 300);
    } else {
      window.location.href = targetUrl;
    }
  };

  const handleEpisodeSwitch = (index) => {
    const nextEpisodeUrl = `${window.location.origin}/watch/${id}?ep=${index}`;
    const adUrl = "https://omg10.com/4/10484905";

    const newWindow = window.open(nextEpisodeUrl, '_blank');
    if (newWindow) {
      newWindow.focus();
      setTimeout(() => {
        window.location.assign(adUrl);
      }, 300);
    } else {
      navigate(`/watch/${id}?ep=${index}`);
    }
  };

  if (!movie) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#fbbf24]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative">
      
      {/* Background Hero Blur - Matching MovieDetails theme */}
      <div className="absolute inset-0 h-[45vh] w-full overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img 
          src={movie.poster_url || movie.image} 
          className="w-full h-full object-cover opacity-20 blur-md scale-105" 
          alt="" 
        />
      </div>

      {/* 1. TOP NAV BAR */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-400 hover:text-[#fbbf24] transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest text-white uppercase">Ahabanza</span>
          </button>
          
          <h1 className="text-xs md:text-sm font-black uppercase truncate max-w-[150px] md:max-w-md italic tracking-tighter text-slate-200">
             {isSeriesOrCollection ? `${movie.title} - S1 Ep ${currentEpIndex + 1}` : movie.title}
          </h1>

          <div className="flex items-center gap-3">
             <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-0 lg:gap-8 lg:p-6 relative z-10">
        
        {/* 2. PLAYER SECTION */}
        <div className="flex-1">
          <div className="relative w-full aspect-video bg-black shadow-2xl lg:rounded-3xl overflow-hidden border border-white/10 group">
            <iframe
              key={activeVideoUrl} 
              src={activeVideoUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={movie.title}
              frameBorder="0"
              allow="autoplay; fullscreen"
            ></iframe>
          </div>

          {/* ESSENTIAL BUTTONS SECTION */}
          <div className="p-5 lg:px-2 lg:py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
              <div className="text-center md:text-left">
                <h4 className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Uri kureba:</h4>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                  {isSeriesOrCollection ? (currentEpisode?.title || `Episode ${currentEpIndex + 1}`) : movie.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleActionTrigger(activeVideoUrl)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#fbbf24] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  <Play size={18} fill="black" /> REBA VIDEO
                </button>
                
                <button 
                  onClick={() => handleActionTrigger(currentEpisode?.downloadLink || movie.download_url)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-green-500/20"
                >
                  <Download size={18} /> DOWNLOAD
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC SIDEBAR: Series Episodes OR Movie Suggestions */}
        <div className="w-full lg:w-[420px] p-5 lg:p-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-[#fbbf24] rounded-full shadow-[0_0_10px_#fbbf24]"></div>
            <h3 className="font-black uppercase tracking-widest text-xs text-white uppercase tracking-[0.2em]">
              {isSeriesOrCollection ? 'Episodes Zindi' : 'Izindi Filime'}
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {isSeriesOrCollection ? (
              // SERIES SIDEBAR: Show Next Episodes
              episodes.map((ep, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-4 p-3 rounded-2xl border transition-all cursor-pointer group ${
                    idx === currentEpIndex 
                      ? 'bg-[#fbbf24]/20 border-[#fbbf24]/50 shadow-lg' 
                      : 'bg-white/[0.02] border-transparent hover:bg-white/[0.04] hover:border-white/5'
                  }`}
                  onClick={() => handleEpisodeSwitch(idx)}
                >
                  <div className="relative w-32 md:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 shadow-lg">
                    <img 
                      src={movie.poster_url || movie.image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} fill="white" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className={`font-black text-[11px] uppercase truncate tracking-tight ${idx === currentEpIndex ? 'text-[#fbbf24]' : 'text-slate-200'}`}>
                       {ep.title || `Part ${idx + 1}`}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-widest font-black">
                       S01 E{idx + 1}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // MOVIE SIDEBAR: Show Related Movie Suggestions
              allMovies
                .filter(m => m.id !== movie.id && m.type !== 'series')
                .slice(0, 12)
                .map((m) => (
                  <Link 
                    key={m.id} 
                    to={`/movie/${m.id}`}
                    className="flex gap-4 p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="relative w-32 md:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 shadow-lg">
                      <img 
                        src={m.poster_url || m.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={m.title} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} fill="white" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="font-black text-[11px] uppercase truncate text-slate-200 group-hover:text-[#fbbf24] transition-colors">
                        {m.title}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                         {m.year || '2026'} • {m.interpreter_name || 'Agasobanuye'}
                      </span>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;