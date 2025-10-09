/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#012939",
        secondary: "#a0f92d",
        white: "#ffffff",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        cursive: ["cursive"],
      },
      fontSize: {
        base: "0.9375rem", // 15px
      },
      lineHeight: {
        base: "1.6",
      },
      maxWidth: {
        container: "1320px",
      },
      spacing: {
        container: "1320px",
      },
    },
  },
  plugins: [],
};
