/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'vintage-cream': '#f8f4e9',
        'sepia-dark': '#3c2f2d',
        'muted-gold': '#b89f72',
        'parchment': '#f2ebd9',
        'warm-gray': '#6b6260',
        'dark-burgundy': '#4a2c2a',
        'light-taupe': '#c9b9a8',
      },
      spacing: {
        'section-spacing': '100px',
      },
      borderRadius: {
        'custom': '8px',
      },
      boxShadow: {
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'elevation-3': '0 6px 18px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      filter: {
        'sepia-0.2': 'sepia(0.2)',
        'sepia-0.3': 'sepia(0.3)',
      },
      zIndex: {
        '1': '1',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.filter-sepia-0\\.2': { filter: 'sepia(0.2)' },
        '.filter-sepia-0\\.3': { filter: 'sepia(0.3)' },
        '.perspective-1000px': { perspective: '1000px' }, // Add perspective here
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
