// tailwind.config.js

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "maplestory-bold": ["MaplestoryOTFBold", "sans-serif"],
      },

      fontSize: (() => {
        let fontSize = {};
        for (let i = 1; i <= 100; i++) {
          fontSize[`${i}vw`] = `${i}vw`;
        }
        return fontSize;
      })(),

      spacing: (() => {
        let spacing = {};
        for (let i = 1; i <= 100; i++) {
          spacing[`${i}vw`] = `${i}vw`;
          spacing[`${i}vh`] = `${i}vh`;
        }
        return spacing;
      })(),

      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-out": "fadeOut 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
