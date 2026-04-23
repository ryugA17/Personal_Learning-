/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        story:   ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        space: {
          void: '#03030a',
          deep: '#060614',
          mid: '#0a0a2e',
          nebula: '#1a1a4e',
        },
        accent: {
          violet: '#6c5ce7',
          lavender: '#a29bfe',
          cyan: '#00cec9',
          gold: '#fdcb6e',
          star: '#f8f9ff',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
