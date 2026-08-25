/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Coffee palette
        bean:   '#2B1B12', // darkest roast
        ink:    '#241611', // body text
        roast:  '#4A2C1A',
        brew:   '#6F4E37', // classic coffee
        crema:  '#C8A27A',
        foam:   '#F3E9DD',
        milk:   '#FBF6F0',
        paper:  '#FAF7F2', // page background
        line:   '#E6DACB', // hairline rules
        leaf:   '#4F7942', // coffee plant green
        cherry: '#B23A2E', // coffee cherry red
        gold:   '#A8813F', // seal accent
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,27,18,0.04), 0 8px 24px -16px rgba(43,27,18,0.28)',
        lift: '0 2px 4px rgba(43,27,18,0.05), 0 18px 40px -22px rgba(43,27,18,0.42)',
      },
      letterSpacing: {
        official: '0.18em',
      },
      maxWidth: {
        content: '78rem',
      },
    },
  },
  plugins: [],
};
