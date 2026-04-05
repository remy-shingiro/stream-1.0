import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Calendar, Star, ArrowLeft, Clock, Info, ShieldCheck, Zap } from 'lucide-react';

const MovieDetails = ({ allContent }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const movie = useMemo(() => 
    allContent.find(m => m.id.toString() === id.toString()), 
  [allContent, id]);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [id]);

  if (!movie) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbbf24]"></div>
    </div>
  );

  const handleRevenueTrigger = (e) => {
    if(e) e.preventDefault();

    // --- TAB FLIP LOGIC DISABLED ---
    // const adUrl = "https://omg10.com/4/10484905"; 
    const watchUrl = `${window.location.origin}/watch/${movie.id}`;
    
    // Simply navigate to the movie watch page directly in the current window
    navigate(`/watch/${movie.id}`);

    /* // Logic commented out to stop ads and tab flipping
    const newWindow = window.open(watchUrl, '_blank');
    setIsOptimizing(true);

    if (newWindow) {
        newWindow.focus();
        setTimeout(() => {
            window.location.assign(adUrl);
        }, 400);
    } else {
        window.location.href = watchUrl;
    }
    */
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-10 relative font-sans">
      
      {/* FLOATING BACK BUTTON */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed top-24 left-4 z-50 p-2.5 bg-black/60 rounded-full border border-white/10 hover:bg-[#fbbf24] hover:text-black transition-all shadow-xl active:scale-90 group"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Hero Backdrop */}
      <div className="relative h-[35vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img 
          src={movie.poster_url || movie.image} 
          className="w-full h-full object-cover opacity-20 blur-sm scale-105" 
          alt="" 
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-24">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Poster Section */}
          <div className="w-full max-w-[280px] mx-auto lg:mx-0 group cursor-pointer" onClick={handleRevenueTrigger}>
            <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                <img src={movie.poster_url || movie.image} alt={movie.title} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play fill="white" size={48} className="drop-shadow-2xl" />
                </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 text-center lg:text-left pt-4 lg:pt-8">
            <h1 className="text-3xl md:text-6xl font-black uppercase mb-3 tracking-tighter leading-none italic drop-shadow-lg">
              {movie.title}
            </h1>

            {movie.interpreter_name && (
              <div className="inline-flex items-center gap-2 bg-[#fbbf24] text-black font-black px-3 py-1 rounded-md mb-4 text-[10px] uppercase shadow-lg shadow-yellow-500/20">
                <Zap size={12} fill="black" />
                Yasobanuwe na: {movie.interpreter_name}
              </div>
            )}

            {/* Metadata Bar */}
            <div className="flex justify-center lg:justify-start gap-5 mb-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <span><Calendar size={12} className="inline mr-1 text-red-600" /> {movie.year || '2026'}</span>
              <span className="text-[#fbbf24]"><Star size={12} fill="currentColor" className="inline mr-1" /> {movie.rating || '8.5'} IMDB</span>
              <span><Clock size={12} className="inline mr-1 text-blue-400" /> {movie.duration || 'N/A'}</span>
            </div>

            {/* Description Box */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-5 rounded-2xl mb-6 shadow-inner">
              <h3 className="text-[#fbbf24] font-black uppercase mb-2 text-[10px] tracking-[0.4em] flex items-center justify-center lg:justify-start gap-2 opacity-60">
                <Info size={12} /> Ibisobanuro
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium italic line-clamp-3 lg:line-clamp-none">
                {movie.description || `Kanda hano urebe iyi filime isobanuye neza mu Kinyarwanda. Iyi filime "${movie.title}" iri mu bwoko bwa ${movie.type === 'series' ? 'Series' : 'Cinema'} kandi irimo amashusho meza cyane ya HD.`}
              </p>
            </div>

            {/* WATCH NOW BUTTON */}
            <div className="flex flex-col gap-2 items-center lg:items-start">
                <button 
                  disabled={isOptimizing}
                  onClick={handleRevenueTrigger}
                  className={`group relative flex items-center justify-center gap-3 ${isOptimizing ? 'bg-slate-800 text-slate-500 shadow-none' : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-green-600 hover:to-green-400 text-white'} w-full lg:w-max px-12 py-5 rounded-xl font-black text-xl transition-all shadow-[0_15px_40px_rgba(220,38,38,0.3)] hover:-translate-y-1 active:scale-95 border border-white/10`}
                >
                {isOptimizing ? (
                    <span className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-[#fbbf24] border-t-transparent rounded-full"></div>
                        Gutunganya...
                    </span>
                ) : (
                    <>
                        <Play fill="white" size={24} />
                        DOWNLOAD-WATCH FILIME YOSE
                    </>
                )}
                </button>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                    <ShieldCheck size={12} className="text-green-500" /> Safe & Secure Streaming
                </p>
            </div>
          </div>
        </div>

        {/* --- SMART SUGGESTIONS --- */}
        <div className="mt-16 border-t border-white/5 pt-12">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-1.5 h-6 bg-[#fbbf24] rounded-full shadow-[0_0_10px_#fbbf24]"></div>
             <h2 className="text-xl font-black uppercase tracking-widest">
                {movie.type === 'series' ? 'Series zindi ushobora kureba' : 'Izindi filime ushobora kureba'}
             </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {allContent
              .filter(item => 
                item.id !== movie.id && 
                (movie.type === 'series' ? (item.type === 'series' || item.category === 'Series') : (item.type !== 'series' && item.category !== 'Series'))
              )
              .slice(0, 10)
              .map((m) => (
              <Link key={m.id} to={`/movie/${m.id}`} className="group block">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 bg-slate-900">
                  <img src={m.poster_url || m.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-red-600 p-2 rounded-full shadow-lg">
                        <Play fill="white" size={20} />
                    </div>
                  </div>
                </div>
                <h4 className="text-white font-bold text-[10px] uppercase truncate group-hover:text-[#fbbf24] transition-colors tracking-widest">
                    {m.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;