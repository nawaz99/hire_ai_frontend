/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ Enables dark mode using the `.dark` class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          blue: "#2563eb",   // Tailwind blue-600
          green: "#16a34a",  // Tailwind green-600
          purple: "#7c3aed", // Tailwind purple-600
          rose: "#e11d48",   // Tailwind rose-600
        },
      },
    },
  },
  plugins: [],
};
