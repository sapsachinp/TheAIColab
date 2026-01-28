/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dewa-green': '#00A651',
        'dewa-blue': '#0072BC',
        'dewa-dark': '#1E3A5F',
      }
    },
  },
  plugins: [
    require('tailwindcss-rtl')
  ],
}
