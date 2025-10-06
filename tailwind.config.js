/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': 'rgba(0, 0, 0, 0.8)',
        'app-border': 'rgba(255, 255, 255, 0.2)',
        'app-text': '#e5e5e7',
        'app-text-secondary': 'rgba(255, 255, 255, 0.6)',
        'app-input': 'rgba(0, 0, 0, 0.3)',
        'app-button': 'rgba(0, 0, 0, 0.5)',
        'app-hover': 'rgba(255, 255, 255, 0.1)',
        'app-focus': '#007aff',
        'app-focus-shadow': 'rgba(0, 122, 255, 0.2)'
      },
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      }
    },
  },
  plugins: [],
}