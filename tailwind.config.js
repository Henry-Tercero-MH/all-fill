/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta tomada de las tarjetas de color
        ink: '#171818', // Army Black
        coral: {
          DEFAULT: '#F95C4B', // Algerian Coral
          600: '#E8483A',
        },
        forest: '#023A22', // Off-Road Green
        navy: '#003162', // Prestige Mauve (navy)
        teal: '#23ABBD', // Chrysocolla Blue
        sky: '#AAD1F1', // Gabriella Soft Blue
        cream: '#FFF0BA', // Colonial White
        spring: '#02F5A1', // Medium Spring Green
        paper: '#FBFAF7', // blanco cálido de fondo
        // Azul eléctrico del logo ALL-FILL (glow del hexágono)
        electric: {
          DEFAULT: '#076DDF',
          glow: '#2E8BFF',
          deep: '#0A47A3',
        },
        // Grises metálicos (acero/plata)
        steel: {
          light: '#E8EBEF',
          DEFAULT: '#9AA3AD',
          dark: '#3A4048',
        },
        gunmetal: '#0E0F10',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        500: '500',
        600: '600',
        700: '700',
        800: '800',
        900: '900',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(23, 24, 24, 0.35)',
        lift: '0 28px 60px -28px rgba(23, 24, 24, 0.45)',
        glow: '0 0 28px -2px rgba(7, 109, 223, 0.45)',
      },
    },
  },
  plugins: [],
}
