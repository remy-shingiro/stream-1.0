import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { X, Key, Loader2, ShieldCheck, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PaywallModal = ({ isOpen, onClose }) => {
  const [tokenCode, setTokenCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleActivateToken = async (e) => {
    e.preventDefault();
    
    const formattedCode = tokenCode.trim().toUpperCase();
    if (!formattedCode.startsWith('AGA-')) {
      toast.error("Code format should start with 'AGA-'");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("You must be logged in to activate a code.");

      // 1. Is the code they typed valid and unused?
      const tokensRef = collection(db, 'tokens');
      const tokenQuery = query(tokensRef, 
        where('token_code', '==', formattedCode),
        where('status', '==', 'unused')
      );
      
      const tokenSnapshot = await getDocs(tokenQuery);

      if (tokenSnapshot.empty) {
        toast.error("Invalid code or already used. Please check again.");
        setLoading(false);
        return;
      }

      const tokenDoc = tokenSnapshot.docs[0];
      const tokenData = tokenDoc.data();
      
      // 🚀 NEW LOGIC: TIME STACKING
      // Let's see if this user ALREADY has an active, unexpired token.
      const userTokensQuery = query(tokensRef,
        where('used_by', '==', currentUser.uid),
        where('status', '==', 'active')
      );
      
      const userTokensSnapshot = await getDocs(userTokensQuery);
      
      // Assume the start time is right now.
      let baselineDate = new Date(); 

      // If they have existing tokens, find the one that expires the LATEST.
      if (!userTokensSnapshot.empty) {
        let latestExpiration = new Date(0); // Very old date to start
        
        userTokensSnapshot.forEach((doc) => {
          const expDate = new Date(doc.data().expires_at);
          if (expDate > latestExpiration) {
            latestExpiration = expDate;
          }
        });

        // If their latest token is still active in the future, we stack ON TOP of that date!
        if (latestExpiration > baselineDate) {
           baselineDate = latestExpiration; 
           toast.success("Time added to your existing subscription!");
        }
      }

      // 3. Calculate the new expiration date starting from the baseline
      let finalExpiresAt = new Date(baselineDate);
      
      if (tokenData.plan_type === '1_day') finalExpiresAt.setHours(finalExpiresAt.getHours() + 24);
      else if (tokenData.plan_type === '1_week') finalExpiresAt.setDate(finalExpiresAt.getDate() + 7);
      else if (tokenData.plan_type === '1_month') finalExpiresAt.setDate(finalExpiresAt.getDate() + 30);

      // 4. Lock the token to this user and set the stacked expiration date
      await updateDoc(doc(db, 'tokens', tokenDoc.id), {
        status: 'active',
        used_by: currentUser.uid,
        activated_at: new Date().toISOString(), // Still record exactly when they typed it
        expires_at: finalExpiresAt.toISOString()
      });

      toast.success("Movie Unlocked! Enjoy watching.");
      
      onClose();
      window.location.reload();

    } catch (error) {
      console.error("Token Activation Error:", error);
      toast.error(error.message || "An error occurred while activating your code.");
    } finally {
      setLoading(false);
    }
  };

  // ... (The rest of the UI return block remains exactly the same) ...
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-8 bg-slate-900 border border-amber-400/20 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.1)]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400/10 text-amber-400 rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
            Injiza Code (Token)
          </h2>
          <p className="text-slate-400 text-sm px-4">
            If you have paid for a ticket, enter your premium access code below to unlock the movie.
          </p>
        </div>

        <form onSubmit={handleActivateToken} className="space-y-5">
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
            <input 
              type="text" 
              required
              placeholder="e.g. AGA-X9B2V1"
              value={tokenCode}
              onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-center text-lg tracking-widest px-12 py-4 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-700 uppercase"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !tokenCode}
            className="w-full flex justify-center items-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Fungura Filime'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-bold">Nta code ufite?</p>
          <a 
            href="https://wa.me/25078XXXXXXX" // Put your actual WhatsApp number here
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors bg-green-400/10 hover:bg-green-400/20 px-4 py-2 rounded-full"
          >
            <MessageCircle size={16} />
            Kanda hano ugure Code kuri WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
};

export default PaywallModal;