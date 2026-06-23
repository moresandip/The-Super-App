/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",   // extra-small — phones above 480px
        // sm: 640px   ← Tailwind default
        // md: 768px   ← Tailwind default
        // lg: 1024px  ← Tailwind default
        // xl: 1280px  ← Tailwind default
      },
      colors: {
        darkBg: "#0f0f12",
        panelBg: "#1e1e24",
        widgetBg: "#13131a",
        accentGreen: "#10b981",
        accentNeon: "#1df8a9",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
