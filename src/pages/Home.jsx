import { Link } from 'react-router-dom'; 
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import useStructuredData from '../hooks/useStructuredData';

const Home = ({ contentData, onMovieClick, searchTerm }) => {

  // SEO Configuration
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
      
      {/* 1. HERO SECTION (Only shows if NOT searching) */}
      {!searchTerm && (
        <Hero 
          movies={contentData.slice(0, 5)} 
          onPlay={onMovieClick} 
        />
      )}

      {/* 2. MOVIE GRID CONTAINER */}
      {/* CHANGED: Removed '-mt-20'. Added 'mt-10' to push it down. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-10 relative z-10">
        
        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-brand-gold rounded-full shadow-[0_0_10px_#FFD700]"></div>
             <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
               {searchTerm ? `Results: "${searchTerm}"` : "Filime nshya & Series"}
             </h2>
           </div>
        </div>

        {/* Grid Content */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {filteredContent.map((item, index) => (
              <Link key={item.id} to={`/watch/${item.id}`} className="block w-full">
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
             <p className="text-sm">Gerageza gushaka iyindi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;