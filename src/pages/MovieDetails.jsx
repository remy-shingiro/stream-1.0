import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Calendar, Star, ArrowLeft, Clock, Info, ShieldCheck, Zap, Mic2, Mic } from 'lucide-react';

const MovieDetails = ({ allContent }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const movie = useMemo(() => 
    allContent.find(m => m.id.toString() === id.toString()), 
  [allContent, id]);

  // 🚀 OPTIMIZATION: Memoized the suggested movies so the heavy filtering logic 
  // only runs once when the component mounts, rather than on every render.
  const suggestedMovies = useMemo(() => {
    if (!movie) return [];
    return allContent
      .filter(item => 
        item.id !== movie.id && 
        (movie.type === 'series' ? (item.type === 'series' || item.category === 'Series') : (item.type !== 'series' && item.category !== 'Series'))
      )
      .slice(0, 10);
  }, [allContent, movie]);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [id]);

  if (!movie) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
    </div>
  );

  const handleRevenueTrigger = (e) => {
    if(e) e.preventDefault();
    navigate(`/watch/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-10 relative font-sans">
      
      {/* FLOATING BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="fixed top-24 left-4 z-50 p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-amber-400 hover:text-black transition-all shadow-xl active:scale-90 group"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Hero Backdrop */}
      <div className="relative h-[30vh] lg:h-[35vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img 
          src={movie.poster_url || movie.image} 
          className="w-full h-full object-cover opacity-30 blur-md scale-110" 
          alt="" 
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-20 lg:-mt-24">
        
        {/* 🚀 FIXED: Mobile/Tablet/Desktop Responsive Grid Layout */}
        <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr] lg:grid-cols-[280px_1fr] gap-x-5 lg:gap-x-8 gap-y-6 items-start">
          
          {/* 1. POSTER SECTION (Left Column) */}
          <div className="col-span-1 row-span-1 lg:row-span-2 relative shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group cursor-pointer" onClick={handleRevenueTrigger}>
            <img src={movie.poster_url || movie.image} alt={movie.title} className="w-full h-auto transition-transform duration-700 group-hover:scale-110 object-cover aspect-[2/3]" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Play fill="white" size={32} className="drop-shadow-2xl lg:w-16 lg:h-16" />
            </div>
          </div>

          {/* 2. TITLE & META SECTION (Right Column) */}
          <div className="col-span-1 flex flex-col justify-center lg:pt-8 text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black uppercase mb-2 lg:mb-3 tracking-tighter leading-none italic drop-shadow-lg line-clamp-3">
              {movie.title}
            </h1>
            
            {movie.interpreter_name && (
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-black font-black px-2 py-1 lg:px-3 lg:py-1.5 rounded-md mb-3 lg:mb-4 text-[9px] lg:text-[10px] uppercase shadow-lg shadow-yellow-500/20 w-fit">
                <Mic2 size={15} fill="black" />
                Yasobanuwe na: {movie.interpreter_name}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 lg:gap-5 text-slate-400 font-bold text-[9px] lg:text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar size={12} className="text-red-600" /> {movie.year || '2026'}</span>
              <span className="flex items-center gap-1 text-amber-400"><Star size={12} fill="currentColor" /> {movie.rating || '8.5'} IMDB</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-blue-400" /> {movie.duration || 'N/A'}</span>
            </div>
          </div>

          {/* 3. DESCRIPTION & BUTTON SECTION (Spans Full Width on Mobile, Stays Right on Desktop) */}
          <div className="col-span-2 lg:col-span-1 lg:col-start-2 flex flex-col gap-6">
            
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-4 lg:p-5 rounded-2xl shadow-inner text-left">
              <h3 className="text-amber-400 font-black uppercase mb-2 text-[10px] tracking-[0.4em] flex items-center gap-2 opacity-60">
                <Info size={12} /> Ibisobanuro
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium italic">
                {movie.description || `Kanda hano urebe iyi filime isobanuye neza mu Kinyarwanda. Iyi filime "${movie.title}" iri mu bwoko bwa ${movie.type === 'series' ? 'Series' : 'Cinema'} kandi irimo amashusho meza cyane ya HD.`}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-center lg:items-start w-full">
                <button 
                  disabled={isOptimizing}
                  onClick={handleRevenueTrigger}
                  className={`group relative flex items-center justify-center gap-3 ${isOptimizing ? 'bg-slate-800 text-slate-500 shadow-none' : 'bg-amber-400 hover:bg-white text-black'} w-full lg:w-max px-8 lg:px-12 py-4 lg:py-5 rounded-xl font-black text-lg lg:text-xl transition-all shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:-translate-y-1 active:scale-95 border border-white/10`}
                >
                {isOptimizing ? (
                    <span className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full"></div>
                        Gutunganya...
                    </span>
                ) : (
                    <>
                        <Play fill="black" size={20} className="lg:w-6 lg:h-6" />
                        DOWNLOAD-WATCH FILIME
                    </>
                )}
                </button>
                <p className="text-slate-500 text-[9px] lg:text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 mt-2">
                    <ShieldCheck size={12} className="text-green-500" /> Safe & Secure Streaming
                </p>
            </div>

          </div>
        </div>

        {/* --- SMART SUGGESTIONS --- */}
        <div className="mt-16 border-t border-white/5 pt-12">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
             <h2 className="text-lg lg:text-xl font-black uppercase tracking-widest">
                {movie.type === 'series' ? 'Series zindi ushobora kureba' : 'Izindi filime ushobora kureba'}
             </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {suggestedMovies.map((m) => (
              <Link key={m.id} to={`/movie/${m.id}`} className="group block">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 bg-slate-900">
                  <img src={m.poster_url || m.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt={m.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-amber-400 p-2 rounded-full shadow-lg">
                        <Play fill="black" size={20} />
                    </div>
                  </div>
                </div>
                <h4 className="text-white font-bold text-[10px] uppercase truncate group-hover:text-amber-400 transition-colors tracking-widest">
                    {m.title}
                </h4>
                {/* 🚀 FIXED: Added Interpreter logic to Suggestions Grid */}
                {m.interpreter_name && (
                  <p className="text-slate-400 text-[8px] uppercase truncate flex items-center gap-1 mt-1 tracking-wider font-bold">
                    <Mic2 size={15} className="text-amber-400" fill="currentColor" /> {m.interpreter_name}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;