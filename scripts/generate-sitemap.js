import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const USER = process.env.GITHUB_USER || process.env.VITE_GITHUB_USERNAME;
const REPO = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO;
const SITE = process.env.VITE_SITE_URL || "https://agasobanuyefilime.com";

// We use the "Raw" GitHub links directly. Much faster.
const MOVIES_URL = `https://raw.githubusercontent.com/${USER}/${REPO}/main/movies.json`;
const SERIES_URL = `https://raw.githubusercontent.com/${USER}/${REPO}/main/series.json`;

async function fetchJson(url, name) {
  console.log(`🔗  Fetching ${name}: ${url}`);
  try {
    // Added a cache-buster so the sitemap ALWAYS gets the freshest data
    const res = await fetch(`${url}?t=${Date.now()}`);
    if (!res.ok) {
      console.warn(`   ⚠️ Failed to fetch ${name} (Status: ${res.status})`);
      return [];
    }
    const data = await res.json();
    
    // Handle different JSON structures safely
    if (Array.isArray(data)) return data;
    if (data.movies) return data.movies;
    if (data.series) return data.series;
    if (data.data) return data.data;
    
    return [];
  } catch (err) {
    console.error(`   ❌ Error reading ${name}:`, err.message);
    return [];
  }
}

async function generateSitemap() {
  console.log("------------------------------------------------");
  console.log("🕷️   Sitemap Generator (Direct File Mode)");
  console.log(`👤  User: ${USER}`);
  console.log(`📦  Repo: ${REPO}`);

  if (!USER || !REPO) {
    console.error("❌  ERROR: Missing GITHUB_USER or GITHUB_REPO in .env");
    process.exit(1);
  }

  // 1. Fetch the two big files
  const movies = await fetchJson(MOVIES_URL, "Movies");
  const series = await fetchJson(SERIES_URL, "Series");
  
  // 2. Combine them
  const allContent = [...movies, ...series];
  console.log(`\n🎉  Total Database: ${allContent.length} items.`);

  // 3. Generate XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  // Main Routes
  sitemap += `\n  <url>\n    <loc>${SITE}/</loc>\n    <priority>1.0</priority>\n  </url>`;
  sitemap += `\n  <url>\n    <loc>${SITE}/seasons</loc>\n    <priority>0.9</priority>\n  </url>`;

  allContent.forEach((item) => {
    if (!item.id) return;

    // 🚀 FIXED: Pointing to /movie/ instead of /watch/ to match App.jsx routing
    // When we update AdminPanel, item.id will be the readable movie name!
    const url = `${SITE}/movie/${item.id}`;
    
    const lastMod = item.updated_at 
      ? new Date(item.updated_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    sitemap += `\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  });

  sitemap += `\n</urlset>`;

  // 4. Save
  const publicPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, sitemap);
  console.log(`✅  SUCCESS! Sitemap saved to public/sitemap.xml`);
  console.log("------------------------------------------------");
}

generateSitemap();