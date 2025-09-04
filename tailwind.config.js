/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['Oswald', 'sans-serif'],
      },
      backgroundImage: {
        'logo-gradient': 'radial-gradient(ellipse at center, #06b6d4 0%, #2563eb 35%, #1e40af 70%, #1e3a8a 100%)',
        'logo-gradient-dark': 'radial-gradient(ellipse at center, #22d3ee 0%, #3b82f6 35%, #2563eb 70%, #1d4ed8 100%)',
      },
    },
  },
  plugins: [],
};
