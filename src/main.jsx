import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 1. Import the Provider
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* 2. Wrap your App inside the Provider */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
  </StrictMode>,
)