import { useState, useEffect, useMemo, Suspense, lazy } from 'react'; 
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ReactGA from "react-ga4"; 

// 1. STATIC IMPORTS 
import { fetchAllData } from './services/githubService'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingDonation from './components/FloatingDonation';

// 2. DYNAMIC IMPORTS
const Home = lazy(() => import('./pages/Home'));
// 🚀 FIX 1: Import the new Seasons page we created!
const Seasons = lazy(() => import('./pages/Seasons')); 
const WatchPage = lazy(() => import('./pages/WatchPage'));
const MovieDetails = lazy(() => import('./pages/MovieDetails')); 
const AdminPanel = lazy(() => import('./components/AdminPanel')); 
const Login = lazy(() => import('./components/Login'));
const WatchModal = lazy(() => import('./components/WatchModal')); 

// --- TRACKER COMPONENT ---
const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return null;
};

// --- NAVIGATION WRAPPER ---
const AppContent = ({ 
  allContent, 
  seriesContent, 
  searchTerm, 
  setSearchTerm, 
  selectedContent, 
  setSelectedContent 
}) => {
  const navigate = useNavigate();

  // --- CLEAN NAVIGATION (NO TAB FLIPPING) ---
  const handleNavigation = (movie) => {
    setSelectedContent(null);
    setSearchTerm(""); 
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans relative overflow-x-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <FloatingDonation />

      <Navbar 
          onSearch={setSearchTerm} 
          data={allContent}
          onItemClick={handleNavigation} 
      />

      <div className={selectedContent ? "hidden" : "block pt-0 mt-0"}>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  contentData={allContent} 
                  searchTerm={searchTerm} 
                  onMovieClick={handleNavigation} 
                />
              } 
            />
            
            {/* 🚀 FIX 2: Point the /seasons route to the actual Seasons component! */}
            <Route 
              path="/seasons" 
              element={
                <Seasons 
                  // We pass allContent because the Seasons component filters it automatically
                  contentData={allContent} 
                  searchTerm={searchTerm} 
                />
              } 
            />
            
            <Route path="/movie/:id" element={<MovieDetails allContent={allContent} />} />
            <Route path="/watch/:id" element={<WatchPage allMovies={allContent} />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel movies={allContent} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </div>

      {selectedContent && (
         <Suspense fallback={<div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white font-black uppercase text-xs tracking-widest">Loading Player...</div>}>
            <WatchModal 
              content={selectedContent}
              allContent={allContent} 
              onClose={() => setSelectedContent(null)}
              onContentChange={setSelectedContent}
              onSearch={setSearchTerm} 
            />
         </Suspense>
      )}

      <Footer />
    </div>
  );
};

function App() {
  const [fetchedData, setFetchedData] = useState(() => {
    try {
      const saved = localStorage.getItem('site_content_cache');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(() => !localStorage.getItem('site_content_cache'));
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    ReactGA.initialize("G-6N373FLFPF"); 
    const loadContent = async () => {
      try {
        const data = await fetchAllData();
        localStorage.setItem('site_content_cache', JSON.stringify(data));
        setFetchedData(data);
      } catch (error) {
        console.error("Failed to update", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const allContent = useMemo(() => {
    if (fetchedData.length === 0) return [];
    const seenIds = new Set();
    return fetchedData.map((item) => {
      let uniqueId = item.id;
      let counter = 1;
      while (seenIds.has(uniqueId)) {
        uniqueId = `${item.id}_copy${counter}`;
        counter++;
      }
      seenIds.add(uniqueId);
      return { ...item, id: uniqueId };
    });
  }, [fetchedData]);

  const seriesContent = useMemo(() => {
    return allContent.filter(item => item.type === 'series' || item.category === 'Series');
  }, [allContent]);

  if (isLoading) return <SkeletonLoader />;

  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <AppContent 
        allContent={allContent}
        seriesContent={seriesContent}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
      />
    </BrowserRouter>
  );
}

export default App;