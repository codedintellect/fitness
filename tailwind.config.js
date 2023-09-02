/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(246, 220, 255)',
        'secondary': 'rgb(0, 0, 0)',
        'selection': 'rgb(141, 49, 196)',
        'fallback': 'rgb(148, 148, 148)',
      }
    }
  },
  plugins: [],
}
