module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tiktok: {
          DEFAULT: '#FE2C55',
          dark: '#161823',
          light: '#FFFFFF',
          gray: '#F1F1F2',
          text: '#161823'
        }
      },
      fontFamily: {
        sans: ['Proxima Nova', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
