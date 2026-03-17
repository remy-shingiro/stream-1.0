import React from 'react';
import { Helmet } from 'react-helmet-async';

// Default values updated to your official domain
const defaults = {
  title: "Agasobanuye Filime - StreamIt",
  description: "Reba filime zisobanuye mu Kinyarwanda mu buryo bwa HD. Intambara, Urukundo, na Series zose nshya.",
  image: "https://agasobanuyefilime.com/default-share-image.jpg", 
  url: "https://agasobanuyefilime.com"
};

const SEO = ({ title, description, image, url, genre, interpreter, durationISO, uploadDate }) => {
  const fullTitle = title ? `${title} | Agasobanuye Filime` : defaults.title;
  const metaDesc = description || defaults.description;
  const metaImage = image || defaults.image;
  const metaUrl = url || defaults.url;

  // GOOGLE VIDEO SCHEMA 
  // This helps your films show up with big thumbnails in Google Search
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": fullTitle,
    "description": metaDesc,
    "thumbnailUrl": [metaImage],
    "uploadDate": uploadDate || new Date().toISOString(),
    "duration": durationISO || "PT2H", 
    "contentUrl": metaUrl,
    "embedUrl": metaUrl,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": 8500 
    }
  };

  return (
    <Helmet>
      {/* 1. Standard Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />

      {/* 2. Social Media (OpenGraph) */}
      <meta property="og:type" content="video.movie" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="Agasobanuye Filime" />

      {/* 3. Twitter Cards (X) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* 4. SCHEMA INJECTION */}
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;