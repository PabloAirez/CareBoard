/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1E40AF",
          light: "#DBEAFE",
        },
        secondary: {
          DEFAULT: "#10B981",
          dark: "#047857",
          light: "#D1FAE5",
        },
        accent: {
          DEFAULT: "#7C3AED",
          dark: "#5B21B6",
          light: "#EDE9FE",
        },
      },
    },
  },
};