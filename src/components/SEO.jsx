import React from 'react';
import { Helmet } from 'react-helmet-async';

// Default values to prevent crashes if data is missing
const defaults = {
  title: "StreamIt - Agasobanuye Films",
  description: "Watch the latest Agasobanuye movies in HD. Intambara, Urukundo, and more.",
  image: "https://agasobanuyefilime.com/default-share-image.jpg", // REPLACE THIS with a real image URL
  url: "https://agasobanuyefilime.com"
};

const SEO = ({ title, description, image, url, genre, interpreter, durationISO, uploadDate }) => {
  const fullTitle = title ? `${title} | StreamIt` : defaults.title;
  const metaDesc = description || defaults.description;
  const metaImage = image || defaults.image;
  const metaUrl = url || defaults.url;

  // GOOGLE VIDEO SCHEMA (The Cheat Code)
  // This tells Google: "This is a video, please show the big thumbnail"
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": fullTitle,
    "description": metaDesc,
    "thumbnailUrl": [metaImage],
    "uploadDate": uploadDate || new Date().toISOString(), // Fallback to today
    "duration": durationISO || "PT2H", // Default to 2 hours if missing (Format: PT[Hours]H[Minutes]M)
    "contentUrl": metaUrl,
    "embedUrl": metaUrl,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": 5000 // You can make this dynamic later
    }
  };

  return (
    <Helmet>
      {/* 1. Standard Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />

      {/* 2. WhatsApp / Facebook (OpenGraph) */}
      <meta property="og:type" content="video.movie" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="StreamIt" />

      {/* 3. Twitter Cards (X) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* 4. INJECT THE SCHEMA CHEAT CODE */}
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;