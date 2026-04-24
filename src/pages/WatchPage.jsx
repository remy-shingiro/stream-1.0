import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Play, Download, Mic2, Loader2, Lock, CheckCircle2 
} from 'lucide-react';
import CommentSection from '../components/CommentSection';

// 🚀 FIREBASE & SECURE MODALS IMPORTS
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // NEW IMPORT for silent checking
import AuthModal from '../components/AuthModal';
import PaywallModal from '../components/PaywallModal';

const WatchPage = ({ allMovies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // --- VIP SECURITY STATES ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  
  // null = 'checking', true = 'premium access', false = 'locked'
  const [hasAccess, setHasAccess] = useState(null); 
  const [isCheckingClick, setIsCheckingClick] = useState(false);

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

  // 🚀 SILENT VIP CHECK ON PAGE LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
    setHasAccess(null); // Reset to checking state when movie changes

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setHasAccess(false); // Not logged in -> Locked
        return;
      }

      // God Mode Bypass
      if (user.email === 'shingiroremy303@gmail.com') {
        setHasAccess(true);
        return;
      }

      // Silent Token Check
      try {
        const tokensRef = collection(db, 'tokens');
        const q = query(tokensRef, 
          where('used_by', '==', user.uid), 
          where('status', '==', 'active')
        );
        
        const querySnapshot = await getDocs(q);
        let valid = false;
        const now = new Date();

        querySnapshot.forEach((doc) => {
          if (now < new Date(doc.data().expires_at)) {
            valid = true;
          }
        });

        setHasAccess(valid);
      } catch (error) {
        console.error("Silent Check Error:", error);
        setHasAccess(false);
      }
    });

    return () => unsubscribe();
  }, [id, currentEpIndex]);


  // 🚀 BUTTON ACTION GATE (For users who click when locked, or for Downloads)
  const handleActionClick = (actionType, targetUrl) => {
    if (!targetUrl) return;

    // If they already have access, just do the action immediately! No freezing.
    if (hasAccess) {
      if (actionType === 'download') {
        window.open(targetUrl, '_blank');
      } else if (actionType === 'watch') {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back up to the video
      }
      return;
    }

    // If they DON'T have access, figure out which wall they hit
    setIsCheckingClick(true);
    if (!auth.currentUser) {
      setShowAuthModal(true);
    } else {
      setShowPaywallModal(true);
    }
    setIsCheckingClick(false);
  };

  const handleEpisodeSwitch = (index) => {
    navigate(`/watch/${id}?ep=${index}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: movie?.title,
      text: `Reba ${movie?.title} isobanuye mu Kinyarwanda!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!movie) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative pt-20 pb-20">
      
      {/* Background Hero Blur */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] w-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img 
          src={movie.poster_url || movie.image} 
          className="w-full h-full object-cover opacity-20 blur-md scale-105" 
          alt="" 
        />
      </div>

      {/* SECONDARY INFO BAR */}
      <div className="relative z-30">
        <div className="max-w-[1800px] mx-auto px-4 pb-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-all group bg-slate-900/50 hover:bg-slate-900 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase text-[10px] tracking-widest text-white">Subira Inyuma</span>
          </button>
          
          <button 
             onClick={handleShare}
             className="p-2.5 bg-slate-900/50 border border-white/5 backdrop-blur-md hover:bg-amber-400 hover:text-black rounded-full text-slate-300 transition-all active:scale-95"
           >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-0 lg:gap-8 lg:px-6 relative z-10">
        
        {/* PLAYER SECTION (LEFT COLUMN) */}
        <div className="flex-1">
          
          <div className="relative w-full aspect-video bg-black shadow-2xl lg:rounded-3xl overflow-hidden border border-white/10 group flex items-center justify-center">
            
            {/* STATE 1: LOADING (Checking Firebase silently) */}
            {hasAccess === null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/80 backdrop-blur-sm">
                <Loader2 size={40} className="animate-spin text-amber-400 mb-4" />
                <p className="text-amber-400 text-xs font-black tracking-[0.2em] uppercase animate-pulse">Checking Access...</p>
              </div>
            )}

            {/* STATE 2: UNLOCKED (Premium VIP Access) */}
            {hasAccess === true && (
              <iframe
                key={activeVideoUrl} 
                src={activeVideoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={movie.title}
                frameBorder="0"
                allow="autoplay; fullscreen"
              ></iframe>
            )}

            {/* STATE 3: LOCKED (Free User) */}
            {hasAccess === false && (
              <>
                <img 
                  src={movie.poster_url || movie.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  alt="Movie Poster"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <button 
                  onClick={() => handleActionClick('watch', activeVideoUrl)}
                  disabled={isCheckingClick}
                  className="relative z-10 flex flex-col items-center gap-3 bg-amber-400/90 hover:bg-amber-400 text-black px-10 py-6 rounded-3xl backdrop-blur-sm transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                >
                  <div className="bg-black/10 p-3 rounded-full mb-1">
                    <Lock fill="black" size={32} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-[0.2em]">Fungura Video</span>
                </button>
              </>
            )}
          </div>

          {/* ESSENTIAL BUTTONS SECTION */}
          <div className="p-5 lg:px-2 lg:py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
              <div className="text-center md:text-left">
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Uri kureba:</h4>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none text-white">
                  {isSeriesOrCollection ? (currentEpisode?.title || `Episode ${currentEpIndex + 1}`) : movie.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* 🚀 FIXED: Dynamic Watch Button based on VIP status */}
                <button 
                  onClick={() => handleActionClick('watch', activeVideoUrl)}
                  disabled={isCheckingClick}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50
                    ${hasAccess 
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 cursor-default hover:bg-amber-400/20' 
                      : 'bg-amber-400 text-black hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                    }
                  `}
                >
                  {hasAccess ? (
                     <><CheckCircle2 size={18} /> PREMIUM ACTIVE</>
                  ) : (
                     <><Play size={18} fill="black" /> REBA VIDEO</>
                  )}
                </button>
                
                <button 
                  onClick={() => handleActionClick('download', currentEpisode?.downloadLink || movie.download_url)}
                  disabled={isCheckingClick}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-green-500/20 disabled:opacity-70"
                >
                  <Download size={18} /> DOWNLOAD
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 lg:px-2 pb-12">
            <CommentSection movieId={movie.id} />
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[420px] p-5 lg:p-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
            <h3 className="font-black text-xs text-white uppercase tracking-[0.2em]">
              {isSeriesOrCollection ? 'Episodes Zindi' : 'Izindi Filime'}
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {isSeriesOrCollection ? (
              episodes.map((ep, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-4 p-3 rounded-2xl border transition-all cursor-pointer group ${
                    idx === currentEpIndex 
                      ? 'bg-amber-400/20 border-amber-400/50 shadow-lg' 
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
                    <h4 className={`font-black text-[11px] uppercase truncate tracking-tight ${idx === currentEpIndex ? 'text-amber-400' : 'text-slate-200'}`}>
                       {ep.title || `Part ${idx + 1}`}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                       S01 E{idx + 1}
                    </span>
                  </div>
                </div>
              ))
            ) : (
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
                      <h4 className="font-black text-[11px] uppercase truncate text-slate-200 group-hover:text-amber-400 transition-colors">
                        {m.title}
                      </h4>
                      <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                         <Mic2 size={10} className="text-amber-400" /> 
                         {m.interpreter_name || 'Agasobanuye'}
                      </span>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <PaywallModal 
        isOpen={showPaywallModal} 
        onClose={() => setShowPaywallModal(false)} 
      />
      
    </div>
  );
};

export default WatchPage;