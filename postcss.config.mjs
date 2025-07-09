const config = {
  plugins: ["@tailwindcss/postcss"],
  theme: {
    extend: {
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
};

export default config;
