/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./web/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial-custom": "radial-gradient(ellipse at center, white 0.5rem, rgb(0, 0, 0, 0) 40rem)",
        "grid": "url('/web/assets/default-background.svg')",
      },
      keyframes: {
        "app-logo-spin": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "app-logo-spin": "app-logo-spin infinite 20s linear"
      }
    },
  },
  plugins: [],
}