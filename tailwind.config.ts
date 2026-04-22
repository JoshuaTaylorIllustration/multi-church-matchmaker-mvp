import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        flyerYellow: "#FFED04",
      },
    },
  },
  plugins: [],
};

export default config;
