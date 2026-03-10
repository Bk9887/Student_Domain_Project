import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        zinc: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
        }
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '100%': { transform: 'translateY(-40px) translateX(30px)' },
        }
      }
    },
  },
  plugins: [
    typography,
  ],
}