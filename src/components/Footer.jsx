import { Link } from 'react-router-dom';

const Footer = () => {
  // REPLACE THIS WITH YOUR ACTUAL WHATSAPP GROUP LINK
  const whatsappGroupLink = "https://chat.whatsapp.com/BezV8sO4UeG6XvXI5fWo7D";

  return (
    // 🎨 FIXED: Changed from pure black to slate-950 to perfectly match App.jsx
    <footer className="bg-slate-950 text-gray-400 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      
      {/* 🎨 FIXED: Swapped 'brand-gold' for 'amber-400' */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Identity */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center group-hover:border-red-500 transition">
                <span className="text-red-600 font-bold text-sm group-hover:text-red-500">▶</span>
              </div>
              <span className="text-amber-400 font-bold text-lg tracking-wide">Agasobanuye</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Your number one destination for translated movies and series. Entertainment made accessible for everyone.
            </p>
          </div>

          {/* Column 2: Movies */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Browse Movies</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Action Movies</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Romantic Drama</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Cartoons & Kids</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">New Releases</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/seasons" className="hover:text-amber-400 transition-colors">Action</Link></li>
              <li><Link to="/seasons" className="hover:text-amber-400 transition-colors">Seasons</Link></li>
              <li><Link to="/movies" className="hover:text-amber-400 transition-colors">Filime zose</Link></li>
            </ul>
          </div>

          {/* Column 4: Community */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Join Community</h3>
            <p className="text-sm text-gray-500 mb-4">
              Join our WhatsApp group to get updates on the latest releases and request movies.
            </p>
            <a 
              href={whatsappGroupLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-sm transition-colors"
            >
              <span>Join WhatsApp Group</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 text-center md:text-left">
            {/* Dynamic Year */}
            © {new Date().getFullYear()} AgasobanuyeFilime. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <a 
        href={whatsappGroupLink}
        target="_blank" 
        rel="noopener noreferrer"
        // 🚀 FIXED: Mobile bottom-24 avoids the bottom nav. Desktop md:bottom-6 rests in the corner.
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 group"
        aria-label="Join WhatsApp Group"
      >
        <span className="absolute -inset-1.5 rounded-full bg-green-500 opacity-20 group-hover:opacity-40 animate-pulse"></span>
        {/* 🚀 FIXED: Reduced padding (p-2.5) to make the button smaller */}
        <button className="relative bg-[#25D366] hover:bg-[#20bd5a] p-2.5 md:p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center">
          {/* 🚀 FIXED: Reduced SVG size to w-6 h-6 on mobile */}
          <svg className="w-6 h-6 md:w-7 md:h-7 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </button>
      </a>
    </footer>
  );
};

export default Footer;