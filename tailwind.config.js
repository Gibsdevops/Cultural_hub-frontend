/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-amber': '#C8651B',
        'brand-amber-light': '#E8895A',
        'brand-forest': '#2D6A4F',
        'brand-forest-light': '#40916C',
        'brand-cream': '#FDF6EC',
        'brand-sunset': '#F4845F',
        'brand-indigo': '#1A1040',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};