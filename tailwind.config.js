/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#121212",
        "dark-sidebar": "#1e1e1e",
        "dark-green": "#0e3a1f",
        "dark-green-light": "#1b5e34",
      },
    },
  },
  plugins: [],
};
