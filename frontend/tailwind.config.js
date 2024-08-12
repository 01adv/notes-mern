/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //color used in project
      colors:{
        primary: '#2885FF',
        secondary: '#EF864E'
      }
    },
  },
  plugins: [],
} 