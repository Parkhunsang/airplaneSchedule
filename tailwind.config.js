/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#667eea",
        secondary: "#764ba2",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
