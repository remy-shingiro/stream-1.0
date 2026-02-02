import { Link } from 'react-router-dom'; 
import { Play, Layers, ChevronRight } from 'lucide-react'; 
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import useStructuredData from '../hooks/useStructuredData';

const Home = ({ contentData, onMovieClick, searchTerm }) => {

  // SEO
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Agasobanuye Filime",
    "url": "https://agasobanuyefilime.com/",
  });
  
  if (!contentData) return null;

  const filteredContent = contentData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      
      {/* 1. HERO SECTION */}
      {!searchTerm && (
        <Hero 
          movies={contentData.slice(0, 5)} 
          onPlay={onMovieClick} 
        />
      )}

      {/* 2. MOVIE GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-10 relative z-10">
        
        {/* --- SECTION HEADER WITH GLOWING BUTTON --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-6">
           
           {/* Title */}
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-brand-gold rounded-full shadow-[0_0_15px_#FFD700]"></div>
             <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide drop-shadow-lg">
               {searchTerm ? `Results: "${searchTerm}"` : "Filime nshya & Series"}
             </h2>
           </div>

           {/* --- NEW GLOWING BUTTON --- */}
           {!searchTerm && (
             <Link 
               to="/seasons" 
               className="relative group flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 to-red-500 text-white px-8 py-3 rounded-full font-black text-sm tracking-wider uppercase transition-all duration-300
               
               /* THE GLOW EFFECT */
               shadow-[0_0_20px_rgba(220,38,38,0.5)] 
               hover:shadow-[0_0_35px_rgba(220,38,38,0.8)] 
               hover:scale-105 active:scale-95 border border-red-400/20"
             >
               {/* Tiny "Pulse" Dot for the 'Alive' feel */}
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
               </span>

               <Layers size={20} className="drop-shadow-md" />
               <span className="drop-shadow-md">SEASONS ZOSE</span>
               <ChevronRight size={20} className="opacity-80 group-hover:translate-x-1 transition-transform" />
             </Link>
           )}
        </div>

        {/* --- GRID CONTENT --- */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {filteredContent.map((item, index) => (
              <Link key={item.id} to={`/watch/${item.id}`} className="block w-full group">
                <MovieCard 
                  movie={item}
                  index={index}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500 opacity-50">
             <div className="text-6xl mb-4">😕</div>
             <p className="text-xl font-bold">Nta filime ibonetse</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;