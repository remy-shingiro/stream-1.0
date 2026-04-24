import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { KeyRound, Plus, Loader2, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const TokenGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [copied, setCopied] = useState(false);

  // 🚀 THE ADMIN LOCK: Only your specific email can access the generator
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  if (auth.currentUser?.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 pt-20">
        <ShieldAlert size={64} className="mb-6 opacity-20" />
        <h2 className="text-3xl font-black uppercase tracking-widest text-slate-700">Access Denied</h2>
        <p className="mt-2 text-sm">Only authorized administrators can mint tokens.</p>
      </div>
    );
  }

  const generateToken = async (planType) => {
    setLoading(true);
    setCopied(false);
    try {
      // 1. Generate the random code
      const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newTokenCode = `AGA-${randomChars}`;

      // 2. Save directly to the database
      await addDoc(collection(db, 'tokens'), {
        token_code: newTokenCode,
        plan_type: planType, 
        status: 'unused',
        created_at: new Date().toISOString(),
      });

      setLastGenerated({ code: newTokenCode, plan: planType });
      toast.success(`${planType} token successfully minted!`);
      
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error("Failed to generate token.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (lastGenerated) {
      navigator.clipboard.writeText(lastGenerated.code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto p-8 bg-slate-900 border border-amber-400/20 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.05)] text-white">
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-800">
          <div className="bg-amber-400/10 p-3 rounded-xl text-amber-400">
            <KeyRound size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest">Token Factory</h1>
            <p className="text-sm text-slate-400">Generate premium access codes for users</p>
          </div>
        </div>

        {/* GENERATOR BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <button 
            onClick={() => generateToken('1_day')}
            disabled={loading}
            className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-amber-400 hover:bg-amber-400/5 transition-all group disabled:opacity-50"
          >
            <Plus size={28} className="mb-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
            <span className="font-black text-lg">24 Hours</span>
            <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Daily Pass</span>
          </button>

          <button 
            onClick={() => generateToken('1_week')}
            disabled={loading}
            className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-amber-400 hover:bg-amber-400/5 transition-all group disabled:opacity-50"
          >
            <Plus size={28} className="mb-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
            <span className="font-black text-lg">7 Days</span>
            <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Weekly Pass</span>
          </button>

          <button 
            onClick={() => generateToken('1_month')}
            disabled={loading}
            className="flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-amber-400 hover:bg-amber-400/5 transition-all group disabled:opacity-50"
          >
            <Plus size={28} className="mb-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
            <span className="font-black text-lg">30 Days</span>
            <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Monthly Pass</span>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-amber-400" size={40} />
          </div>
        )}

        {/* RESULTS DISPLAY */}
        {lastGenerated && !loading && (
          <div className="relative p-8 bg-amber-400/10 border border-amber-400/30 rounded-2xl text-center animate-in zoom-in-95 duration-300">
            <p className="text-sm text-amber-500 font-bold uppercase tracking-widest mb-3">
              Successfully Minted ({lastGenerated.plan})
            </p>
            <div className="text-5xl font-black text-amber-400 tracking-[0.2em] font-mono select-all mb-6">
              {lastGenerated.code}
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all active:scale-95"
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Code to Send'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenGenerator;