import React, { useEffect } from 'react';
import { Film, Globe, Zap, Users } from 'lucide-react';

const About = () => {
  // Scrolls to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-300">
      <div className="max-w-4xl mx-auto">
        
        {/* SEO-Optimized Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6 drop-shadow-lg">
            Urugo rwa <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Filime Zisobanuye</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium">
            Agasobanuye Filime is Rwanda's premium platform for high-quality, translated entertainment. We bring the world's best movies and series directly to your screen, professionally translated into Kinyarwanda.
          </p>
        </div>

        {/* Core Value Pillars (Great for both Users and Search Engines) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-amber-400/30 transition-colors shadow-lg">
            <Globe className="text-amber-400 mb-4" size={32} />
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Kinyarwanda Translations</h2>
            <p className="text-gray-400 leading-relaxed">
              We specialize in delivering the latest Hollywood blockbusters, Asian cinema, and hit TV series with accurate and highly entertaining Kinyarwanda translations (Agasobanuye). Entertainment has no language barrier here.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-amber-400/30 transition-colors shadow-lg">
            <Zap className="text-amber-400 mb-4" size={32} />
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Fast & Mobile-Optimized</h2>
            <p className="text-gray-400 leading-relaxed">
              Designed specifically for East African network conditions, our platform ensures smooth video playback and minimal buffering, whether you are streaming from a desktop in Kigali or a smartphone on the go.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-amber-400/30 transition-colors shadow-lg">
            <Film className="text-amber-400 mb-4" size={32} />
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Filime Nshya Buri Munsi</h2>
            <p className="text-gray-400 leading-relaxed">
              Our library is updated daily. From action-packed movies to romantic drama series and kids' cartoons, we have the largest collection of new releases ready to watch.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-amber-400/30 transition-colors shadow-lg">
            <Users className="text-amber-400 mb-4" size={32} />
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Our Community</h2>
            <p className="text-gray-400 leading-relaxed">
              We are more than just a website; we are a community of movie lovers. Join our active WhatsApp groups to request specific films, interact with our team, and get instantly notified about new drops.
            </p>
          </div>
        </section>

        {/* SEO Text Block (Heavy Keywords, but reads naturally) */}
        <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center animate-in fade-in duration-1000">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4">Shakisha uwo uri we natwe</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto text-sm">
            Whether you are searching for <strong>filime nshya zisobanuye</strong>, classic action series, or the best interpreters in Rwanda, Agasobanuye Filime is your ultimate destination. Experience the joy of cinema in your native language today.
          </p>
        </section>

      </div>
    </main>
  );
};

export default About;