/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f5',
          100: '#ccefeb',
          200: '#99dfd7',
          300: '#66cfc3',
          400: '#33bfaf',
          500: '#00af9b',
          600: '#008c7c',
          700: '#00695d',
          800: '#00463e',
          900: '#00231f',
        },
        secondary: {
          50: '#fef5e7',
          100: '#fdeacf',
          200: '#fbd59f',
          300: '#f9c06f',
          400: '#f7ab3f',
          500: '#f59610',
          600: '#c4780d',
          700: '#935a0a',
          800: '#623c06',
          900: '#311e03',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
        english: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
