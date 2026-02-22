import React, { useState } from 'react';
import { Heart, X, Copy, Check } from 'lucide-react';

const FloatingDonation = () => {
  const [showDonation, setShowDonation] = useState(false);
  const [copiedType, setCopiedType] = useState(null); // Tracks which item was copied

  const momoDetails = {
    tel: "0781286272",
    code: "1962055"
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed bottom-28 right-6 z-[9999] flex flex-col items-end gap-3">
      {showDonation && (
        <div className="bg-slate-900 border border-[#fbbf24]/40 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[280px] animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-start mb-2">
            <Heart size={16} className="text-red-500" fill="currentColor" />
            <button onClick={() => setShowDonation(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <p className="text-[11px] text-slate-200 font-medium leading-relaxed italic mb-4">
            "Inkunga yawe idufasha gukomeza kubagezaho filime nshya zisobanuye neza kubuntu. Murakoze kudushyigikira! UTANGA AYO UBASHIJE KUBONA - AYARIYO YOSE!!"
          </p>

          <div className="space-y-2">
            {/* Phone Number Copy Button */}
            <button 
              onClick={() => handleCopy(momoDetails.tel, 'tel')}
              className="w-full py-2 px-3 bg-[#fbbf24] rounded-xl flex flex-col items-center justify-center shadow-md hover:bg-[#fcd34d] transition-all group active:scale-95"
            >
              <span className="text-black font-black text-[8px] uppercase tracking-tighter opacity-70">
                {copiedType === 'tel' ? 'Yakuwe!' : 'Kanda ukope TEL'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-black font-black text-base tracking-tighter">TEL: {momoDetails.tel}</span>
                {copiedType === 'tel' ? <Check size={14} className="text-green-700" /> : <Copy size={12} className="text-black/30" />}
              </div>
            </button>

            {/* MoMo Code Copy Button */}
            <button 
              onClick={() => handleCopy(momoDetails.code, 'code')}
              className="w-full py-2 px-3 bg-[#fbbf24] rounded-xl flex flex-col items-center justify-center shadow-md hover:bg-[#fcd34d] transition-all group active:scale-95"
            >
              <span className="text-black font-black text-[8px] uppercase tracking-tighter opacity-70">
                {copiedType === 'code' ? 'Yakuwe!' : 'Kanda ukope CODE'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-black font-black text-base tracking-tighter">CODE: {momoDetails.code}</span>
                {copiedType === 'code' ? <Check size={14} className="text-green-700" /> : <Copy size={12} className="text-black/30" />}
              </div>
            </button>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[#fbbf24] font-bold text-[10px] uppercase tracking-widest block">
              Remy Shingiro Rukundo
            </span>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setShowDonation(!showDonation)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-90 ${
          showDonation ? 'bg-white text-black' : 'bg-[#fbbf24] text-red-600 animate-bounce shadow-[#fbbf24]/20'
        }`}
      >
        {showDonation ? (
          <X size={24} className="text-black" />
        ) : (
          <Heart size={24} fill="currentColor" />
        )}
      </button>
    </div>
  );
};

export default FloatingDonation;