/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        cream: '#faf9f6',
        warm: '#f5f0e8',
        gold: '#b8945a',
        'gold-light': '#e8d5b0',
        dark: '#1a1a1a',
        mid: '#6b6560',
        border: '#e8e0d4',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
