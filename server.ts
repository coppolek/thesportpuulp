import express from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

import http from "http";

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Funzione di base per decodificare entità HTML
function decodeHtml(html: string) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  
  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server }
      },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
  }

  app.use(async (req, res, next) => {
    // Only handle GET requests for HTML
    if (req.method !== 'GET') {
      return next();
    }
    try {
      let template: string;
      
      if (!isProd) {
        template = await fs.readFile(path.join(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
      } else {
        template = await fs.readFile(path.join(process.cwd(), "dist", "index.html"), "utf-8");
      }

      let metaTags = `
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ARENA SPORT" />
        <meta property="og:description" content="Il portale dei video sportivi con i migliori highlights da YouTube." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop" />
        <meta property="og:url" content="https://ais-pre-5o35cxqwct6jo7pa6nqpjd-132736654569.europe-west3.run.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ARENA SPORT" />
        <meta name="twitter:description" content="Il portale dei video sportivi con i migliori highlights da YouTube." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop" />
      `;

      // Se c'è un video ID nell'URL
      const videoId = req.query.v as string;
      if (videoId && typeof videoId === "string") {
        const apiKey = process.env.VITE_YOUTUBE_API_KEY || "AIzaSyCKu0X2pU36YIy1tg234sibWLeClMvoldA";
        const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
        
        try {
          const ytRes = await fetch(vUrl);
          if (ytRes.ok) {
            const ytJson = await ytRes.json();
            const item = ytJson.items?.[0];
            if (item) {
              const title = decodeHtml(item.snippet.title);
              const channel = decodeHtml(item.snippet.channelTitle);
              const thumb = item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url;
              
              metaTags = `
                <meta property="og:type" content="video.other" />
                <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
                <meta property="og:description" content="Guarda ${title.replace(/"/g, '&quot;')} di ${channel.replace(/"/g, '&quot;')} su ARENA SPORT" />
                <meta property="og:image" content="${thumb}" />
                <meta property="og:url" content="https://ais-pre-5o35cxqwct6jo7pa6nqpjd-132736654569.europe-west3.run.app/?v=${videoId}" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
                <meta name="twitter:description" content="Guarda ${title.replace(/"/g, '&quot;')} di ${channel.replace(/"/g, '&quot;')} su ARENA SPORT" />
                <meta name="twitter:image" content="${thumb}" />
              `;
            }
          }
        } catch (e) {
          console.error("Errore recupero info video per meta tag:", e);
        }
      }

      const html = template.replace("<!-- META_TAGS -->", metaTags);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      if (!isProd) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
