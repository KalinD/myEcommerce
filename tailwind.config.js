/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      white: '#ffffff',
      text: '#000000',
      background: '#fdfefb',
      primary: '#241155',
      secondary: '#e9c3f3',
      accent: '#2749c4'
    },
  },
  plugins: [],
}
