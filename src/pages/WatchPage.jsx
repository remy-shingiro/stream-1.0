import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Info, Play, MessageSquare, 
  AlertTriangle, ChevronDown, ChevronUp, Zap, Download
} from 'lucide-react';

const WatchPage = ({ allMovies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const movie = useMemo(() => 
    allMovies.find(m => m.id.toString() === id.toString()), 
  [allMovies, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 1. UPDATED: Play Button handles external redirection + Ads
  const handleExternalPlay = (e) => {
    if(e) e.preventDefault();
    
    // Your Monetag Direct Link for the current tab redirect
    const adUrl = "https://omg10.com/4/10484905"; 
    const externalPlayUrl = movie.video_url || movie.url;

    if (externalPlayUrl) {
      // Open the external video player in a new tab
      const newWindow = window.open(externalPlayUrl, '_blank');
      
      if (newWindow) {
        newWindow.focus();
        // Redirect this current tab to an ad
        setTimeout(() => {
          window.location.href = adUrl;
        }, 400);
      } else {
        // Fallback if popup is blocked
        window.location.href = externalPlayUrl;
      }
    }
  };

  const handleDownload = () => {
    const downloadUrl = movie.download_url || movie.url;
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = "_blank";
      link.download = `${movie.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!movie) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#fbbf24]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      
      {/* 1. THEATER HEADER */}
      <div className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-400 hover:text-[#fbbf24] transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest text-white">Ahabanza</span>
          </button>
          
          <h1 className="text-xs md:text-sm font-black uppercase truncate max-w-[150px] md:max-w-md italic tracking-tighter text-slate-200">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-0 lg:gap-8 lg:p-6">
        
        {/* 2. PLAYER & INFO SECTION */}
        <div className="flex-1">
          <div className="relative w-full aspect-video bg-black shadow-2xl lg:rounded-3xl overflow-hidden border border-white/5 group">
            <iframe
              src={movie.video_url || movie.url}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={movie.title}
              frameBorder="0"
              allow="autoplay; fullscreen"
            ></iframe>
          </div>

          <div className="p-5 lg:px-2 lg:py-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none italic">
                  {movie.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span className="text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded">{movie.year || '2026'}</span>
                  <span className="border border-white/10 px-2 py-0.5 rounded">HD 1080P</span>
                  <span>{movie.type === 'series' ? 'Series' : 'Filime'}</span>
                  {movie.interpreter_name && <span className="text-red-500">Na {movie.interpreter_name}</span>}
                </div>
              </div>

              {/* ACTION BUTTONS (EXTERNAL PLAY & GREEN DOWNLOAD) */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={handleExternalPlay}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#fbbf24] text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(251,191,36,0.3)]"
                >
                  <Play size={18} fill="black" /> REBA HANZE
                </button>
                
                <button 
                  onClick={handleDownload}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(22,163,74,0.3)] active:scale-95"
                >
                  <Download size={18} /> Download
                </button>
              </div>
            </div>

            {/* Expandable Description */}
            <div className="mt-8 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full text-[#fbbf24] font-black text-[10px] uppercase tracking-[0.3em] mb-2"
              >
                <span className="flex items-center gap-2"><Info size={14} /> Ibisobanuro</span>
                {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showDetails ? 'max-h-[500px] opacity-100' : 'max-h-12 opacity-50'}`}>
                <p className="text-slate-400 leading-relaxed italic text-sm md:text-base font-medium">
                  {movie.description || `Iyi filime "${movie.title}" isobanuye neza mu Kinyarwanda. Reba iyi filime n'izindi nyinshi kuri StreamIt mu buryo bwa HD.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SIDEBAR */}
        <div className="w-full lg:w-[420px] p-5 lg:p-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-[#fbbf24] rounded-full shadow-[0_0_10px_#fbbf24]"></div>
            <h3 className="font-black uppercase tracking-widest text-xs text-white">Izindi ushobora kureba</h3>
          </div>

          <div className="flex flex-col gap-4">
            {allMovies
              .filter(m => m.id !== movie.id)
              .slice(0, 15)
              .map((item) => (
                <Link 
                  key={item.id} 
                  to={`/movie/${item.id}`} // Recycles ad funnel on Details Page
                  className="flex gap-4 group bg-white/[0.01] hover:bg-white/[0.04] p-3 rounded-2xl border border-transparent hover:border-white/5 transition-all"
                >
                  <div className="relative w-32 md:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    <img src={item.poster_url || item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0 py-1">
                    <h4 className="font-black text-[11px] uppercase truncate group-hover:text-[#fbbf24] transition-colors leading-tight tracking-tight text-slate-200">
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                      {item.type || 'Movie'} • {item.year || '2026'}
                    </span>
                  </div>
                </Link>
              ))}
          </div>

          <div className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
             <div className="p-3 bg-[#fbbf24]/10 rounded-full text-[#fbbf24]">
                <Zap size={24} />
             </div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Kwaza kwamamaza hano?<br/>
                <span className="text-white font-black">Contact us on WhatsApp</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;