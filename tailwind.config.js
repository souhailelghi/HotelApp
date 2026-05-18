/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Dark navy
        accent: "#f59e0b", // Gold/Orange accent
      }
    },
  },
  plugins: [],
}
