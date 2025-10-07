/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        comfort: {
          white: "#FFFFFF",
          tan: "#D9CBB8",
          olive: "#6B8E23",
          navy: "#1B2A41",
          accent: "#F4A261", // warm orange accent
        },
      },
      fontFamily: {
        comfort: ["Inter", "sans-serif"], // swap for your chosen font
      },
    },
  },
  plugins: [],
}