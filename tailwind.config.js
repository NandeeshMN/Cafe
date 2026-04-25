export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          dark: '#3e2723',
          light: '#f5f5f0',
          accent: '#8d6e63',
          primary: '#b71c1c',
          bg: '#faf9f6'
        }
      }
    },
  },
  plugins: [],
}
