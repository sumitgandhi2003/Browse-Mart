/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      mobile: "350px",
      "small-device": "480px",
      tablet: "770px",
      laptop: "990px",
      desktop: "1200px",
      "large-device": "1920px",
    },

    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      clipPath: {
        "polygon-clip": "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        circle: "circle(50%)",
        ellipse: "ellipse(50% 25%)",
      },
    },
  },
  plugins: [],
};
