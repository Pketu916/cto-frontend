/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B1F3B", // dark blue
        secondary: "#FF7A00", // orange
        accent: "#6C4BC0", // purple
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
