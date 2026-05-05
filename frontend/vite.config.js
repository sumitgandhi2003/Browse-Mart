import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    build: {
      outDir: "dist",
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        manifestFilename: "manifest.json",
        includeAssets: [
          "apple-touch-icon.png",
          "sw-push.js",
          "icons/icon-192x192.png",
          "icons/icon-512x512.png",
          "icons/maskable-icon-512x512.png",
        ],
        manifest: {
          name: "Browse Mart E-commerce",
          short_name: "Browse Mart",
          description:
            "Shop products, manage your cart, and track orders in Browse Mart.",
          theme_color: "#2563eb",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
          scope: "/",
          icons: [
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icons/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          importScripts: ["sw-push.js"],
          navigateFallback: "/index.html",
          globPatterns: [
            "**/*.{html,js,css,png,jpg,jpeg,svg,gif,ico,webp,woff2}",
          ],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ["script", "style", "font"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "asset-cache",
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: env.VITE_SERVER_URL || "http://localhost:4000",
    //       changeOrigin: true,
    //       secure: false,
    //       ws: true,
    //     },
    //   },
    // },
  };
});
// export default defineConfig({
//   plugins: [react()],
//   // server: {
//   //   proxy: {
//   //     "/api": {
//   //       target: process.env.VITE_SERVER_URL || "http://localhost:4000",
//   //       changeOrigin: true,
//   //       secure: false,
//   //       ws: true,
//   //     },
//   //   },
//   // },
// });

// export default ({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//   return {
//     plugins: [react()],

//     server: {
//       Proxy: {
//         "/api": {
//           target: env.VITE_SERVER_URL || "http://localhost:4000",
//           changeOrigin: true,
//           secure: false,
//           ws: true,
//         },
//       },
//     },
//   };
// };
