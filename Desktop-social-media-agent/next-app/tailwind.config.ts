import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
};
export default config;
