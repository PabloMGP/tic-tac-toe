/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './*.js'],
  theme: {
    extend: {
      colors: {
        primaryColor: '#ffc700',
        secondaryColor: '#ff6b00',
        fillColor: '#0091bd',
        backgroundPrimary: '#1a2b33',
        backgroundLight: '#273c46',
        backgroundMedium: '#172329',
      }
    },
  },
  plugins: [],
};
