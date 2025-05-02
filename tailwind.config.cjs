/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#E6D7D7',
        'dark-rose': '#D4B8B8',
        'light-rose': '#F0E6E6',
        'maroon-outer': '#2C0B13', // new deep maroon for outer background
        'maroon-container': '#1A0A0F', // new dark maroon/soft black for container
        'maroon-card': '#7B2323', // updated card/box/header/footer background
        'maroon-accent': '#E6B7B7', // accent for links/highlights
        'maroon-text': '#F5F5F5',  // primary text in dark mode
        'maroon-secondary': '#B8B8B8', // secondary text in dark mode
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 