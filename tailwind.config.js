/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#17211d',
        moss: '#466255',
        mint: '#d9f2e3',
        coral: '#f07964',
        amber: '#f0b354',
        sky: '#5d9bd8',
        graphite: '#27312e',
      },
      boxShadow: {
        panel: '0 18px 55px rgba(22, 33, 29, 0.08)',
      },
    },
  },
  plugins: [],
};
