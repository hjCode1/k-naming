/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        peach: '#FDDCB5',
        rose: '#F4A7A3',
        gold: '#F5D9A0',
        charcoal: '#3D3232',
        oheng: {
          wood: '#6B9F6B',
          fire: '#E07A5F',
          earth: '#D4A843',
          metal: '#B8B8B8',
          water: '#4A7DA8',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
        serif: ['"Noto Serif KR"', 'serif'],
      },
    },
  },
  plugins: [],
};
