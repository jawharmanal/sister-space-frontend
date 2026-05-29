/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Sister Space — inspirée des maquettes
        sister: {
          50: '#fff5f7',
          100: '#ffe4ea',
          200: '#fbcfd9',
          300: '#f7a8bc',
          400: '#f185a0',
          500: '#e85d83',  // Rose principal (boutons)
          600: '#d23d6a',
          700: '#b22a55',
          800: '#8e1f44',
          900: '#6b1532',
        },
        peach: {
          100: '#fde2d4',
          200: '#fbc8b0',
          300: '#f8a98a',
        },
        cream: '#fdf6f4', // Fond général
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'], // Pour "just for women" en italique
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}