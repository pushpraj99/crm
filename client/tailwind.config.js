/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7ccbfd',
          400: '#38b0fa',
          500: '#0e95ee',
          600: '#0276cd',
          700: '#025ea7',
          800: '#07508a',
          900: '#0c4372',
          950: '#082a4a',
        }
      }
    },
  },
  plugins: [],
}
