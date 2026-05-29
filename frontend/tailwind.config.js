/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2',
          light: '#42A5F5',
          dark: '#1565C0',
        },
        accent: {
          DEFAULT: '#F57C00',
          light: '#FF9800',
          dark: '#E65100',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#66BB6A',
          dark: '#388E3C',
        },
        dark: '#263238',
        background: '#F5F7FA',
      },
    },
  },
  plugins: [],
};
