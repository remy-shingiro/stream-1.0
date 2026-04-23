import { useState, useEffect, useMemo, Suspense, lazy, useCallback } from 'react'; 
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ReactGA from "react-ga4"; 

// 1. CRITICAL STATIC IMPORTS
import { fetchAllData } from './services/githubService'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import ProtectedRoute from './components/ProtectedRoute';
// 🚀 NEW: Import the Mobile Bottom Navigation
import MobileBottomNav from './components/MobileBottomNav'; 
import TokenGenerator from './pages/TokenGenerator';
// 2. DYNAMIC IMPORTS (Pages)
const Home = lazy(() => import('./pages/Home'));
const Seasons = lazy(() => import('./pages/Seasons')); 
// 🚀 NEW: Dynamic import for your new Movies page
const Movies = lazy(() => import('./pages/Movies')); 
const WatchPage = lazy(() => import('./pages/WatchPage'));
const MovieDetails = lazy(() => import('./pages/MovieDetails')); 
const AdminPanel = lazy(() => import('./components/AdminPanel')); 
const Login = lazy(() => import('./components/Login'));
const About = lazy(()=> import('./pages/About'));

// 3. DYNAMIC IMPORTS (Popups & Heavy Modals)
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
  const location = useLocation();

  // BUG 1 FIX: The "Zombie Modal" Killer
  useEffect(() => {
    setSelectedContent(null);
  }, [location.pathname, setSelectedContent]);

  // BUG 2 FIX: Stop the Re-render Avalanche
  const handleNavigation = useCallback((movie) => {
    setSelectedContent(null);
    setSearchTerm(""); 
    navigate(`/movie/${movie.id}`);
  }, [navigate, setSelectedContent, setSearchTerm]);

  return (
    // 🚀 FIXED: Added pb-16 (padding-bottom) on mobile so the nav doesn't cover content
    <div className="min-h-screen bg-slate-950 font-sans relative overflow-x-hidden pb-24 md:pb-0">

      <Toaster position="bottom-right" reverseOrder={false} />
      
      <Navbar 
          onSearch={setSearchTerm} 
          data={allContent}
          onItemClick={handleNavigation} 
      />

      <div className={selectedContent ? "hidden" : "block pt-0 mt-0"}>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Home contentData={allContent} searchTerm={searchTerm} onMovieClick={handleNavigation} />} />
            
            <Route path="/seasons" element={<Seasons contentData={allContent} searchTerm={searchTerm} />} />
            
            {/* 🚀 NEW: Dedicated Movies Route */}
            <Route path="/movies" element={<Movies contentData={allContent} searchTerm={searchTerm} />} />
            <Route path='/about' element={<About/>}/>
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
            <Route 
              path="/token" 
              element={
                <ProtectedRoute>
                  <TokenGenerator />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </div>

      {/* NON-BLOCKING UI COMPONENTS */}
      <Suspense fallback={null}>
        {selectedContent && (
           <WatchModal 
             content={selectedContent}
             allContent={allContent} 
             onClose={() => setSelectedContent(null)}
             onContentChange={setSelectedContent}
             onSearch={setSearchTerm} 
           />
        )}
      </Suspense>

      {/* 🚀 NEW: Mobile Bottom Navigation added right above Footer */}
      <MobileBottomNav />
      
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