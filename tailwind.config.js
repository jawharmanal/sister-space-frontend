/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ============================================================
      // PALETTE SISTER SPACE - inspirée Glossier / Pinterest pastel
      // ============================================================
      colors: {
        // Rose principal (CTA, accents) — plus poudré que le rose vif
        sister: {
          50:  '#FFF7FB',
          100: '#FDEEF6',
          200: '#FBDDED',
          300: '#F5BFD9',
          400: '#EC9DC0',
          500: '#E879A9',   // couleur principale
          600: '#D45B91',
          700: '#BE5C8F',
          800: '#9C4271',
          900: '#7A3257',
        },

        // Crème — fond chaud des pages
        creme: {
          50:  '#FFFBF8',  // fond pages
          100: '#FAF3EE',
          200: '#F4E9DF',
        },

        // Doré champagne — touches premium
        champagne: {
          100: '#FBE9DA',
          200: '#F4C2A0',
          300: '#E5A479',
        },

        // Mauve — texte secondaire, accents doux
        mauve: {
          50:  '#FAF5F8',
          200: '#E4D2DC',
          400: '#B89AAA',
          500: '#9C7B8A',
          700: '#5C4151',
        },

        // Brun chaud — texte principal (alternative au gris)
        cocoa: {
          800: '#4A3438',
          900: '#3D2B2F',
        },
      },

      // ============================================================
      // TYPOGRAPHIES
      // ============================================================
      fontFamily: {
        // Titres : serif élégant, vibe Pinterest
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Corps : sans-serif moderne, lisible
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },

      // ============================================================
      // OMBRES DOUCES — rose pâle au lieu de gris classique
      // ============================================================
      boxShadow: {
        'pink-soft':  '0 4px 20px -4px rgba(232, 121, 169, 0.15)',
        'pink-md':    '0 8px 30px -8px rgba(232, 121, 169, 0.25)',
        'pink-glow':  '0 0 40px rgba(245, 191, 217, 0.4)',
        'cream':      '0 2px 12px rgba(157, 100, 130, 0.08)',
      },

      // ============================================================
      // RAYONS — coins plus doux
      // ============================================================
      borderRadius: {
        '2xl': '1.25rem',  // 20px
        '3xl': '1.75rem',  // 28px
        '4xl': '2.25rem',  // 36px
      },

      // ============================================================
      // ANIMATIONS
      // ============================================================
      animation: {
        'slide-in':    'slideIn 0.3s ease-out',
        'fade-in':     'fadeIn 0.4s ease-out',
        'fade-in-up':  'fadeInUp 0.5s ease-out',
        'shimmer':     'shimmer 2s linear infinite',
      },

      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // ============================================================
      // GRADIENTS UTILES
      // ============================================================
      backgroundImage: {
        'gradient-sister':   'linear-gradient(135deg, #E879A9 0%, #D45B91 100%)',
        'gradient-cream':    'linear-gradient(180deg, #FFFBF8 0%, #FDEEF6 100%)',
        'gradient-soft':     'linear-gradient(135deg, #FFF7FB 0%, #FBDDED 50%, #FBE9DA 100%)',
        'gradient-champagne':'linear-gradient(135deg, #FBE9DA 0%, #F5BFD9 100%)',
      },
    },
  },

  plugins: [],
}