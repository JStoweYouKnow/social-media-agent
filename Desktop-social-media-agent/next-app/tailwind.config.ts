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
        planner: {
          page: "#F6F3EE",        // main page background
          paper: "#FAF9F7",       // content area background
          sidebar: "#EDE8E1",     // tab/sidebar background
          hover: "#E3DDD5",       // hover state
          border: "#E2DDD5",      // light border
          "border-dark": "#D5D0C9", // darker border
          accent: "#C4A484",      // primary accent (bookmark, bullets)
          "accent-dark": "#B7A28A", // active tab border
          text: "#3A3A3A",        // primary text
          "text-muted": "#7C756B", // muted/inactive text
          "text-medium": "#5B544C", // medium text
          shadow: "#EAE4DC",      // shadow overlay
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        planner: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'planner': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'planner-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'planner-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-planner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
