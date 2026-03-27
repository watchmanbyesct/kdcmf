/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          50:  '#fff0f0',
          100: '#ffd6d6',
          200: '#ffb0b0',
          300: '#ff7a7a',
          400: '#ff3b3b',
          500: '#ff0000',
          600: '#d10000',
          700: '#a00000',
          800: '#7a0000',
          900: '#5c0000',
          950: '#3d0000',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#c9a84c',
          600: '#b8860b',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
      backgroundImage: {
        'crimson-gradient': 'linear-gradient(135deg, #5c0000 0%, #a00000 50%, #7a0000 100%)',
        'gold-gradient': 'linear-gradient(135deg, #b8860b 0%, #c9a84c 50%, #fcd34d 100%)',
      },
    },
  },
  plugins: [],
}

