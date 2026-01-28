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
    const res = await fetch(url);
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
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><priority>1.0</priority></url>
  <url><loc>${SITE}/category/action</loc><priority>0.8</priority></url>`;

  allContent.forEach((item) => {
    if (!item.id) return;

    // Use URL-friendly slugs if possible (e.g. /watch/123-rocky)
    const url = `${SITE}/watch/${item.id}`;
    
    const lastMod = item.updated_at 
      ? new Date(item.updated_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.9</priority>
  </url>`;
  });

  sitemap += `\n</urlset>`;

  // 4. Save
  const publicPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, sitemap);
  console.log(`✅  SUCCESS! Sitemap saved to public/sitemap.xml`);
  console.log("------------------------------------------------");
}

generateSitemap();