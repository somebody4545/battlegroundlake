/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
    "./src/**/*.{html,jsx}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Roboto Serif', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}

