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
    
    // Basic format check (e.g., AGA-XXXXX)
    const formattedCode = tokenCode.trim().toUpperCase();
    if (!formattedCode.startsWith('AGA-')) {
      toast.error("Code format should start with 'AGA-'");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("You must be logged in to activate a code.");

      // 1. Ask Firebase: Does this unused code exist?
      const tokensRef = collection(db, 'tokens');
      const q = query(tokensRef, 
        where('token_code', '==', formattedCode),
        where('status', '==', 'unused')
      );
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Invalid code or already used. Please check again.");
        setLoading(false);
        return;
      }

      // 2. We found a valid code! Let's activate it.
      const tokenDoc = querySnapshot.docs[0];
      const tokenData = tokenDoc.data();
      
      // Calculate expiration date based on the plan you sold them
      const now = new Date();
      let expiresAt = new Date();
      
      if (tokenData.plan_type === '1_day') expiresAt.setHours(expiresAt.getHours() + 24);
      else if (tokenData.plan_type === '1_week') expiresAt.setDate(expiresAt.getDate() + 7);
      else if (tokenData.plan_type === '1_month') expiresAt.setDate(expiresAt.getDate() + 30);

      // 3. Lock the token to this user in Firebase
      await updateDoc(doc(db, 'tokens', tokenDoc.id), {
        status: 'active',
        used_by: currentUser.uid,
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      });

      toast.success("Movie Unlocked! Enjoy watching.");
      
      // Close the modal and force the page to refresh so the Logic Gate runs again
      onClose();
      window.location.reload();

    } catch (error) {
      console.error("Token Activation Error:", error);
      toast.error(error.message || "An error occurred while activating your code.");
    } finally {
      setLoading(false);
    }
  };

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