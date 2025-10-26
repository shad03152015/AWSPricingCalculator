/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'aws-orange': '#FF9900',
        'aws-dark': '#232F3E',
      },
    },
  },
  plugins: [],
}

