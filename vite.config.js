import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      outDir: "dist",
    },
    plugins: [react()],
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
