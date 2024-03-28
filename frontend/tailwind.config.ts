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
        "dark-blue": "#0a2239",
        "light-blue": "#53a2be",
        "lighter-blue": "#a0d6ea",
        "mid-blue": "#1d84b5",
        "green-blue": "#132e32",
        "last-blue": "#176087"
      }
    },
  },
  plugins: [],
};
export default config;
