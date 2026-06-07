/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712',
          surface: '#0B1117',
          border: '#1F2937',
          cyan: '#38BDF8',
          indigo: '#818CF8',
          red: '#EF4444',
          yellow: '#F59E0B',
          green: '#10B981',
          orange: '#F97316',
          tx: '#F1F5F9',
          tx2: '#94A3B8',
          tx3: '#475569',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}