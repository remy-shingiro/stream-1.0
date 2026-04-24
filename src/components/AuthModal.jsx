import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Ensure this points to your firebase.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 1. Log the user in
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Ikaze! (Welcome back)");
        onClose();
        window.location.reload(); // Refresh to update the logic gate
        
      } else {
        // 2. Create a new user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 3. Create their secure profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          role: 'user' // Good for future admin features
        });
        
        toast.success("Konti yaremwe neza! (Account created)");
        onClose();
        window.location.reload(); // Refresh to update the logic gate
      }
    } catch (error) {
      console.error("Auth Error:", error.message);
      
      // Clean up Firebase error messages for the user
      let errorMsg = "Habaye ikibazo. (Something went wrong.)";
      if (error.code === 'auth/email-already-in-use') errorMsg = "Iyi email isanzwe ikoreshwa.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') errorMsg = "Email cyangwa ijambo ry'ibanga sibyo.";
      if (error.code === 'auth/weak-password') errorMsg = "Ijambo ry'ibanga rigomba kugira inyuguti nibura 6.";
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
            {isLogin ? 'Injira' : 'Kora Konti'}
          </h2>
          <p className="text-slate-400 text-sm px-4">
            {isLogin 
              ? 'Injira muri konti yawe kugira ngo ukomeze urebe' 
              : 'Kora konti kugira ngo ubone uko ugura filime'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
            <input 
              type="email" 
              required
              autoComplete='email'
              placeholder="Email yawe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-12 py-4 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
            <input 
              type="password" 
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="Ijambo ry'ibanga (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-12 py-4 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Injira' : 'Kora Konti')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {isLogin 
              ? "Nta konti ufite? Kanda hano uyikore (Sign up)" 
              : "Usanzwe ufite konti? Kanda hano winjire (Log in)"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;