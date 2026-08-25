/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Coffee palette
        bean:   '#2B1B12', // darkest roast
        roast:  '#4A2C1A',
        brew:   '#6F4E37', // classic coffee
        crema:  '#C8A27A',
        foam:   '#F3E9DD',
        milk:   '#FBF6F0',
        leaf:   '#4F7942', // coffee plant green
        cherry: '#B23A2E', // coffee cherry red
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(43,27,18,0.35)',
      },
    },
  },
  plugins: [],
};
