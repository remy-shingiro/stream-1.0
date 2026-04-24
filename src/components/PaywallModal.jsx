import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { X, Key, Loader2, ShieldCheck, MessageCircle, Globe, Smartphone, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

const PaywallModal = ({ isOpen, onClose }) => {
  const [tokenCode, setTokenCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const subscriptionPlans = [
    { id: '1_day', title: 'Umunsi ', price: '200', desc: '24 Hours' },
    { id: '1_week', title: 'Icyumweru ', price: '1000', desc: '7 Days', popular: true },
    { id: '1_month', title: 'Ukwezi ', price: '3000', desc: '30 Days' },
  ];

  const handleActivateToken = async (e) => {
    e.preventDefault();
    const formattedCode = tokenCode.trim().toUpperCase();
    if (!formattedCode.startsWith('AGA-')) {
      toast.error("Format ya Code igomba gutangirwa na 'AGA-'");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Ugomba kuba winjiye.");

      const tokensRef = collection(db, 'tokens');
      const tokenQuery = query(tokensRef, where('token_code', '==', formattedCode), where('status', '==', 'unused'));
      const tokenSnapshot = await getDocs(tokenQuery);

      if (tokenSnapshot.empty) {
        toast.error("Iyi Code ntibyemewe cyangwa yarakoreshejwe.");
        setLoading(false);
        return;
      }

      const tokenDoc = tokenSnapshot.docs[0];
      const tokenData = tokenDoc.data();
      
      const userTokensQuery = query(tokensRef, where('used_by', '==', currentUser.uid), where('status', '==', 'active'));
      const userTokensSnapshot = await getDocs(userTokensQuery);
      let baselineDate = new Date(); 

      if (!userTokensSnapshot.empty) {
        let latestExpiration = new Date(0);
        userTokensSnapshot.forEach((doc) => {
          const expDate = new Date(doc.data().expires_at);
          if (expDate > latestExpiration) latestExpiration = expDate;
        });
        if (latestExpiration > baselineDate) baselineDate = latestExpiration;
      }

      let finalExpiresAt = new Date(baselineDate);
      if (tokenData.plan_type === '1_day') finalExpiresAt.setHours(finalExpiresAt.getHours() + 24);
      else if (tokenData.plan_type === '1_week') finalExpiresAt.setDate(finalExpiresAt.getDate() + 7);
      else if (tokenData.plan_type === '1_month') finalExpiresAt.setDate(finalExpiresAt.getDate() + 30);

      await updateDoc(doc(db, 'tokens', tokenDoc.id), {
        status: 'active',
        used_by: currentUser.uid,
        activated_at: new Date().toISOString(),
        expires_at: finalExpiresAt.toISOString()
      });

      toast.success("Premium yafunguwe neza!");
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error("Habaye ikibazo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl my-8 md:my-auto overflow-hidden p-6 md:p-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-all z-20">
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Agasobanuye Premium</h2>
          <p className="text-slate-500 text-xs mt-1">Hitamo uburyo bwo kwishyura no gufungura filime</p>
        </div>

        {/* 1. COMPACT TIER CARDS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} className={`relative p-3 rounded-2xl border-2 transition-all text-center ${plan.popular ? 'bg-amber-400/5 border-amber-400' : 'bg-white/[0.02] border-white/5'}`}>
              <h3 className="text-white font-black text-[10px] uppercase opacity-60">{plan.title}</h3>
              <div className="text-lg font-black text-white my-0.5">{plan.price}<span className="text-[8px] ml-0.5">Rwf</span></div>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{plan.desc}</p>
            </div>
          ))}
        </div>

        {/* 2. PAYMENT METHODS (Strictly Manual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-[9px] text-black">MTN</div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider">MoMo Code</p>
                  <p className="text-amber-400 font-mono text-sm font-bold">580251 - Remy Shingiro</p>
                </div>
             </div>
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-[9px] text-black">MTN</div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider">MoMo Number</p>
                  <p className="text-amber-400 font-mono text-sm font-bold">0784154697 - Remy Shingiro</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-[9px] text-white">AIR</div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider">Airtel Money</p>
                  <p className="text-red-500 font-mono text-sm font-bold">0724975735 -  Remy Shingiro</p>
                </div>
             </div>
          </div>

          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <Globe size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-wider">WorldRemit / Int.</p>
                <p className="text-blue-400 text-[11px] font-bold">+250 784154697</p>
                <p className="text-slate-500 text-[9px]">Remy Shingiro</p>
             </div>
          </div>
        </div>

        {/* 3. TOKEN INPUT (Directly below) */}
        <div className="bg-amber-400/5 border border-amber-400/20 p-5 rounded-[2rem] mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/50" size={18} />
                    <input 
                        type="text" 
                        required
                        placeholder="INJIZA CODE HANO (AGA-XXXXXX)"
                        value={tokenCode}
                        onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                        className="w-full bg-black/40 border border-white/10 text-white font-mono text-center text-sm tracking-[0.2em] py-4 px-10 rounded-xl focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-700"
                    />
                </div>
                <button 
                    onClick={handleActivateToken}
                    disabled={loading || !tokenCode}
                    className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-black font-black px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 whitespace-nowrap"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Fungura'}
                </button>
            </div>
        </div>

       {/* 4. WHATSAPP SUPPORT BUTTON */}
        <div className="mt-2">
          <a 
            href="https://wa.me/250784154697?text=Muraho%2C%20nshaka%20kugura token kuri%20Agasobanuyefilime%20Premium"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-600/10 uppercase text-[10px] tracking-[0.15em]"
          >
            <MessageCircle size={18} />
            Gura Code kuri WhatsApp
          </a>
          <p className="text-center text-[8px] text-slate-600 font-bold uppercase mt-3 tracking-widest">
            Kanda hano tuguhe code kuri WhatsApp umaze kwishyura
          </p>
        </div>

      </div>
    </div>
  );
};

export default PaywallModal;