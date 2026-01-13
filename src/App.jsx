
import { useState, useEffect, useMemo, Suspense, lazy } from 'react'; 
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ReactGA from "react-ga4"; 

// 1. STATIC IMPORTS 
import { fetchAllData } from './services/githubService'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import ProtectedRoute from './components/ProtectedRoute';

// 2. DYNAMIC IMPORTS
const Home = lazy(() => import('./pages/Home'));
const WatchPage = lazy(() => import('./pages/WatchPage'));
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

function App() {
  // ---------------------------------------------------------------------------
  // 3. OPTIMIZED STATE: "Stale-While-Revalidate" Pattern
  // ---------------------------------------------------------------------------
  
  // A. Try to load data from the phone's LocalStorage immediately
  const [fetchedData, setFetchedData] = useState(() => {
    try {
      const saved = localStorage.getItem('site_content_cache');
      // If we have saved data, use it INSTANTLY.
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Cache parse error", e);
      return [];
    }
  });

  // B. If we found data in storage, we are NOT loading. We show the site immediately.
  const [isLoading, setIsLoading] = useState(() => {
    const saved = localStorage.getItem('site_content_cache');
    return !saved; // Returns false (Not Loading) if cache exists
  });

  const [selectedContent, setSelectedContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Google Analytics ---
  useEffect(() => {
    ReactGA.initialize("G-6N373FLFPF"); 
  }, []);

  // ---------------------------------------------------------------------------
  // 4. OPTIMIZED DATA FETCH
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadContent = async () => {
      try {
        // 1. Fetch fresh data from GitHub in the background
        const data = await fetchAllData();
        
        // 2. Save it to the phone for the NEXT visit
        localStorage.setItem('site_content_cache', JSON.stringify(data));
        
        // 3. Update the screen (User sees new movies pop in)
        setFetchedData(data);
      } catch (error) {
        console.error("Failed to update content", error);
        // Note: Even if this fails (offline), the user still sees the cached data!
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // --- Duplicate Handler (Kept Exact) ---
  const allContent = useMemo(() => {
    if (fetchedData.length === 0) return [];
    const seenIds = new Set();
    
    return fetchedData.map((item) => {
      let uniqueId = item.id;
      let counter = 1;
      while (seenIds.has(uniqueId)) {
        const newId = `${item.id}_copy${counter}`;
        uniqueId = newId;
        counter++;
      }
      seenIds.add(uniqueId);
      return { ...item, id: uniqueId };
    });
  }, [fetchedData]);

  // --- Series Filter (Kept Exact) ---
  const seriesContent = useMemo(() => {
    return allContent.filter(item => 
      item.type === 'series' || item.category === 'Series'
    );
  }, [allContent]);

  // Initial Loading Screen (Only shows for 1st time visitors)
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <BrowserRouter>
      <AnalyticsTracker />
      
      <div className="min-h-screen bg-[#0f0f0f] font-sans relative">
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar onSearch={setSearchTerm} />

        {/* --- PAGE CONTENT --- */}
        <div className={selectedContent ? "hidden" : "block"}>
          <Suspense fallback={
            <div className="flex h-screen items-center justify-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          }>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    contentData={allContent} 
                    searchTerm={searchTerm} 
                    onMovieClick={setSelectedContent} 
                  />
                } 
              />
              <Route 
                path="/seasons" 
                element={
                  <Home 
                    contentData={seriesContent} 
                    searchTerm={searchTerm} 
                    onMovieClick={setSelectedContent} 
                  />
                } 
              />
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

        {/* --- WATCH MODAL --- */}
        {selectedContent && (
           <Suspense fallback={<div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white">Loading Player...</div>}>
              <WatchModal 
                content={selectedContent}
                allContent={allContent} 
                onClose={() => setSelectedContent(null)}
                onContentChange={setSelectedContent}
              />
           </Suspense>
        )}

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;