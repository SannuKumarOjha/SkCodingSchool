/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind")

module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
    ],
    theme: {
      extend: {},
    },
    plugins: [
      flowbite.plugin(),
    ],
  };
