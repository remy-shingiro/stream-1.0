import React, { useState, useEffect } from 'react';
import { Heart, X, Smartphone, AlertTriangle, Copy, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

const SupportUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // --- SMART POPUP & EVENT LISTENER LOGIC ---
  useEffect(() => {
    // 1. Trigger the popup every 30 seconds
    const popupTimer = setInterval(() => {
      setIsModalOpen(true);
    }, 60000); 

    // 2. Listen for the Navbar button click
    const openFromNavbar = () => setIsModalOpen(true);
    window.addEventListener('openDonationModal', openFromNavbar);

    // Cleanup when component unmounts
    return () => {
      clearInterval(popupTimer);
      window.removeEventListener('openDonationModal', openFromNavbar);
    };
  }, []);

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      style: {
        background: '#fff',
        color: '#000',
        border: '1px solid #dc2626',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
    });
  };

  return (
    <>
      {/* =========================================
          1. MOVING BANNER 
          ========================================= */}
      {showBanner && (
        <div className="relative flex items-center bg-white text-black py-3 overflow-hidden z-40 border-b-4 border-red-600 shadow-xl">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 40s linear infinite; 
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="flex-1 overflow-hidden flex items-center">
            <div className="animate-marquee font-black tracking-widest text-xs uppercase flex items-center gap-6 cursor-pointer text-gray-900" onClick={() => setIsModalOpen(true)}>
              <span><AlertTriangle size={16} className="inline text-red-600 mr-2" /> tanga ubufasha kugirango website ikomeze gukora itanga filime zose kubuntu. Umusanzu wawe urakenewe uko ungana kose <AlertTriangle size={16} className="inline text-red-600 ml-2" /></span>
              <span className="text-gray-300">|</span>
              <span><Heart size={16} className="inline text-red-600 mr-2" /> . Kanda hano. <Heart size={16} className="inline text-red-600 ml-2" /></span>
            </div>
          </div>
          
          {/* BANNER CLOSE BUTTON - Increased hit area */}
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors z-10 text-gray-600 hover:text-black flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =========================================
          2. THE MODAL 
          ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          
          <div className="bg-white border-2 border-red-600 rounded-2xl w-full max-w-sm shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar relative animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="bg-red-50 border-b-2 border-red-600 p-4 text-center relative overflow-hidden shrink-0">
              
              {/* MODAL CLOSE BUTTON - Much larger hit target (p-2.5, size=20) */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 bg-white hover:bg-gray-200 p-2.5 rounded-full text-gray-500 hover:text-red-600 transition-colors z-10 shadow-sm border border-gray-200 flex items-center justify-center"
              >
                <X size={20} />
              </button>
              
              <div className="relative z-10 mt-2">
                <div className="bg-white p-2.5 rounded-full w-fit mx-auto mb-2 border border-red-200 shadow-sm animate-pulse">
                  <Heart size={24} className="text-red-600" fill="#dc2626" />
                </div>
                <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter leading-none mb-1">
                  Keep Us Alive!
                </h2>
                <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest mt-1">
                  Tanga ubufasha kugirango website igume ikora kubuntu. Tanga ayo ushoboye.
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-4 space-y-3 bg-white">
              
              {/* 1. MoMo Pay */}
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl hover:border-yellow-500 transition-colors group shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 p-1.5 rounded-lg shrink-0 shadow-sm">
                    <Smartphone size={16} className="text-blue-900" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide">MTN MoMo Pay code</h3>
                  <span className="ml-auto text-[9px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded uppercase">BEST WAY</span>
                </div>
                <div className="bg-white p-2 rounded-lg flex justify-between items-center mt-2 border border-gray-300 shadow-inner">
                  <span className="font-mono text-xl font-black tracking-widest text-gray-900">580251</span>
                  <button 
                    onClick={() => copyToClipboard('580251', 'MoMo Pay Code')}
                    className="flex items-center gap-1 text-[9px] bg-yellow-400 text-blue-900 px-2.5 py-1.5 rounded-full font-black uppercase tracking-widest animate-pulse hover:animate-none hover:scale-105 active:scale-95 transition-all shadow"
                  >
                    <Copy size={10} /> COPY
                  </button>
                </div>
              </div>
                {/* third payment */}
               <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl hover:border-yellow-500 transition-colors group shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 p-1.5 rounded-lg shrink-0 shadow-sm">
                    <Smartphone size={16} className="text-blue-900" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide">MTN MoMo </h3>
                  <span className="ml-auto text-[9px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded uppercase">BEST WAY</span>
                </div>
                <div className="bg-white p-2 rounded-lg flex justify-between items-center mt-2 border border-gray-300 shadow-inner">
                  <span className="font-mono text-xl font-black tracking-widest text-gray-900">078 415 4697</span>
                  <button 
                    onClick={() => copyToClipboard('0784154697', 'MoMo Pay Code')}
                    className="flex items-center gap-1 text-[9px] bg-yellow-400 text-blue-900 px-2.5 py-1.5 rounded-full font-black uppercase tracking-widest animate-pulse hover:animate-none hover:scale-105 active:scale-95 transition-all shadow"
                  >
                    <Copy size={10} /> COPY
                  </button>
                </div>
              </div>

              {/* 2. Airtel Money */}
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl hover:border-red-600 transition-colors shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-600 p-1.5 rounded-lg shrink-0 shadow-sm">
                    <Smartphone size={16} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Airtel Money / MoMo Send</h3>
                </div>
                <div className="bg-white p-2 rounded-lg flex justify-between items-center mt-2 border border-gray-300 shadow-inner">
                  <span className="font-mono text-lg font-bold tracking-widest text-red-600">072 497 5735</span>
                  <button 
                    onClick={() => copyToClipboard('0724975735', 'Phone Number')}
                    className="flex items-center gap-1 text-[9px] bg-gray-800 text-white px-2.5 py-1.5 rounded-full font-black uppercase tracking-widest hover:bg-gray-700 active:scale-95 transition-all shadow"
                  >
                    <Copy size={10} /> COPY
                  </button>
                </div>
              </div>

              {/* 3. NEW: Bank Transfer (BK) */}
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl hover:border-blue-600 transition-colors shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg shrink-0 shadow-sm">
                    <Landmark size={16} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Bank of Kigali (BK)</h3>
                </div>
                <div className="bg-white p-2 rounded-lg flex justify-between items-center mt-2 border border-gray-300 shadow-inner">
                  <span className="font-mono text-sm font-black tracking-widest text-blue-600">1001 7716 0727</span>
                  <button 
                    onClick={() => copyToClipboard('100177160727', 'Bank Account')}
                    className="flex items-center gap-1 text-[9px] bg-gray-800 text-white px-2.5 py-1.5 rounded-full font-black uppercase tracking-widest hover:bg-gray-700 active:scale-95 transition-all shadow"
                  >
                    <Copy size={10} /> COPY
                  </button>
                </div>
              </div>

            </div>
            
            {/* Ad Footer - Increased hit area by making it a full-width block */}
            <div className="bg-gray-100 border-t border-gray-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full block py-4 text-[10px] text-gray-500 hover:text-red-600 font-bold tracking-wider uppercase transition-colors"
              >
                Nzafasha ubutaha.
                filime zose nubuntu<br></br> gufasha ni ubushake
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default SupportUs;