import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Q版魔力宝贝风格配色
        primary: {
          DEFAULT: '#6c5ce7',  // 魔法紫色
          dark: '#5a4ad1',
          light: '#a29bfe',
        },
        secondary: {
          DEFAULT: '#fdcb6e',  // 阳光黄
          dark: '#f5b845',
        },
        background: {
          DEFAULT: '#fff9f0',  // 暖白背景
          paper: '#ffffff',
        },
        accent: {
          pink: '#fd79a8',
          green: '#55efc4',
          blue: '#74b9ff',
        },
      },
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"SimHei"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(108, 92, 231, 0.15)',
        'glow': '0 0 20px rgba(108, 92, 231, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
