import React, { useEffect } from 'react';
import { Film, Globe, Zap, Users, Mic2, Search } from 'lucide-react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🚀 SEO GOLDMINE: These tags render as UI elements but feed Google massive regional context
  const popularSearches = [
    "Agasobanuye Gashya", "Filime z'imirwano (Action)", "Series zisobanuye", 
    "Filime z'Ikirundi", "Filime z'abana", "Inkuru z'urukundo", "Kigali Entertainment", "Agasobanuye mukinyarwanda", "Filime nshyashya", "agasobanuye kubuntu", "Rocky filime nshya", "oshakur", "oshakurfilm"
  ];

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6 drop-shadow-lg">
            Urugo rwa <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Filime Zisobanuye</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium">
            Agasobanuye Filime is Rwanda and Burundi's premium platform for high-quality, translated entertainment. We bring the world's best movies directly to your screen, professionally translated into Kinyarwanda and Kirundi.
          </p>
        </div>

        {/* Core Value Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-amber-400/30 transition-colors shadow-lg">
            <Globe className="text-amber-400 mb-4" size={32} />
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Kinyarwanda & Kirundi</h2>
            <p className="text-gray-400 leading-relaxed">
              We specialize in delivering the latest Hollywood blockbusters, Asian cinema, and hit TV series with accurate and highly entertaining Kinyarwanda translations. Entertainment has no language barrier here.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-amber-400/30 transition-colors shadow-lg">
            <Film className="text-amber-400 mb-4" size={32} />
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Filime Nshya Buri Munsi</h2>
            <p className="text-gray-400 leading-relaxed">
              Our library is updated daily. Whether you want filime z'imirwano (action), romantic dramas, or the latest sci-fi, we have the largest collection of new releases ready to watch.
            </p>
          </div>
        </section>

        {/* 🚀 THE SEO PAYLOAD: Interpreter Section */}
        <section className="bg-slate-900 border border-white/5 rounded-2xl p-8 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5">
            <Mic2 size={200} className="text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-amber-400 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Abasobanuzi Bakunzwe</h2>
            </div>
            
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              We know that a great movie requires a great voice. That is why Agasobanuye Filime brings together the most legendary interpreters in East Africa. Enjoy exclusive translations from the masters of the microphone, including:
            </p>

            {/* Keyword heavy, but looks like a sleek UI grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Rocky Kirabiranya', 'Junior Giti', 'Yakuza', 'Savimbi', 'Sankara', 'Didier', 'skov', 'buringanire', 'b the great', 'siniya', 'mungeli'].map((name) => (
                <div key={name} className="flex items-center gap-3 bg-slate-950 border border-white/5 p-4 rounded-xl">
                  <Mic2 size={18} className="text-amber-400" />
                  <span className="font-bold text-gray-200 uppercase tracking-wide text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 THE SEO PAYLOAD: Regional Search Terms */}
        <section className="text-center animate-in fade-in duration-1000">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-full mb-6 border border-white/5">
            <Search size={24} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Ibyo abantu bashakisha cyane</h2>
          
          {/* Keyword tags */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {popularSearches.map((term, index) => (
              <span 
                key={index}
                className="px-5 py-2.5 bg-slate-900 border border-white/10 rounded-full text-sm font-medium text-gray-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors cursor-default"
              >
                {term}
              </span>
            ))}
          </div>
          
          {/* Final natural language keyword block for Google's paragraph parsers */}
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto mt-8 text-sm">
            Niba ushaka filime zisobanuye mu Kinyarwanda cg mu Kirundi, Agasobanuye Filime niyo nzira yawe. Kanda aha urebe filime nshya zisobanuye, uhitemo izo ukunda, kandi wibere mu isi y'imyidagaduro itagira imipaka.
          </p>
        </section>

      </div>
    </main>
  );
};

export default About;