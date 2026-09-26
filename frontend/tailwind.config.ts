import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paytm: {
          blue: "#00BAF2",
          dark: "#002970",
          accent: "#0088CC",
          light: "#F0F9FF",
          surface: "#F5FAFD",
          border: "#E0EFF7",
          green: "#00A37A",
          greenBg: "#E8F8F2",
          orange: "#EA580C",
          orangeBg: "#FFF4ED",
        }
      },
      borderRadius: {
        'paytm': '14px',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 41, 112, 0.06), 0 1px 4px -1px rgba(0, 41, 112, 0.04)',
        'elevated': '0 10px 25px -5px rgba(0, 41, 112, 0.08), 0 8px 10px -6px rgba(0, 41, 112, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;
