/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A2540",
          lilac: "#A78BFA",
          silver: "#F5F7FA",
        },
      },
    },
  },
  plugins: [],
};
