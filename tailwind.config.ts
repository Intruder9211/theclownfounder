import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#09090b',
          surface: '#121215',
          elevated: '#18181b',
          border: '#27272a',
          borderLight: '#3f3f46',
          accent: '#6366f1',
          accentMuted: 'rgba(99, 102, 241, 0.12)',
          text: '#fafafa',
          muted: '#a1a1aa',
          dim: '#71717a',
          success: '#10b981',
          successMuted: 'rgba(16, 185, 129, 0.12)',
          warning: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
};

export default config;
