
import { Link } from 'react-router-dom'; 
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import useStructuredData from '../hooks/useStructuredData';

const Home = ({ contentData, onMovieClick, searchTerm }) => {

  // Tell Google this is a search engine/streaming site
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Agasobanuye Filime",
    "url": "https://agasobanuyefilime.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://agasobanuyefilime.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  });
  
  // Safety Check
  if (!contentData) return null;

  // Filter logic
  const filteredContent = contentData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* HERO SECTION - Only show if NOT searching */}
      {!searchTerm && (
        <Hero 
          movies={contentData.slice(0, 5)} 
          onPlay={onMovieClick} 
        />
      )}

      {/* MOVIE GRID */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20 relative z-10 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-brand-gold pl-3">
          {searchTerm ? `Search Results: "${searchTerm}"` : "Filime nshya & Series"}
        </h2>

        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            
            {/* 1. SPEED FIX: Added 'index' to the map function */}
            {filteredContent.map((item, index) => (
              
              <Link key={item.id} to={`/watch/${item.id}`} className="block">
                
                <MovieCard 
                  /* 2. LOGIC FIX: Pass the WHOLE item. 
                     If you only pass {title, image}, the badges (Seasons/Parts) won't show 
                     because they need 'item.seasons' and 'item.type'. */
                  movie={item}
                  
                  /* 3. LCP FIX: Pass the index so the first card knows to load instantly */
                  index={index}
                />
                
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">No movies found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;