import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      cursor: {
        custom: 'url(/cursor/pointer.svg), auto',
        pointer: 'url(/cursor/cursor.svg), pointer',
      },
    },
  },
  plugins: [],
};
export default config;
