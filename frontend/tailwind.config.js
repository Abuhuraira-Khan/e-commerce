/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "first-color": "var(--first-color)",
        "second-color": "var(--second-color)",
        "third-color": "var(--third-color)",
        "text-color" : "var(--text-color)",
        "text2-color" :"var(--text2-color)",
        "text3-color" :"var(--text3-color)",
        "four-color" : "var(--four-color)"
      },
      backgroundColors: {
        "first-color": "var(--first-color)",
        "second-color": "var(--second-color)",
        "third-color": "var(--third-color)",
        "text-color" : "var(--text-color)",
        "text2-color" :"var(--text2-color)",
        "text3-color" :"var(--text3-color)",
        "four-color" : "var(--four-color)"
      },
    },
  },
  plugins: [],

}