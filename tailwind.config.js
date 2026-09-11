/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B2436',
        paper: '#F6F3EC',
        navy: '#1E2A4A',
        navy2: '#2C3B63',
        gold: '#C08A2E',
        goldLight: '#E4B658',
        line: '#DAD3C0',
        ok: '#3D7A55',
        err: '#B0433B',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
