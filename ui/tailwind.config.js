module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ["hover", "focus", "active", "odd"],
    display: ["responsive"],
    textColor: ["focus-within", "hover", "active"],
    placeholderColor: ["focus"],
    borderColor: ["focus", "hover"],
    boxShadow: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
