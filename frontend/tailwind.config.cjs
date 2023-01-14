/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '100%': { opacity: '0.7' },
        },
      },
      animation: {
        flicker: 'flicker .3s infinite',
      },
    },
  },
  plugins: [],
}
