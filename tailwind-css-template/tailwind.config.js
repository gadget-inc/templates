/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial-custom": "radial-gradient(ellipse at center, white 0.5rem, rgb(0, 0, 0, 0) 40rem)",
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