/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta BuZCalo - Profesional pero moderna
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff', // Azul principal - confianza y profesionalismo
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#fff4e6',
          100: '#ffd9b3',
          200: '#ffbf80',
          300: '#ffa64d',
          400: '#ff8c1a',
          500: '#ff7700', // Naranja energético - creatividad y conexión
          600: '#cc5f00',
          700: '#994700',
          800: '#663000',
          900: '#331800',
        },
        accent: {
          50: '#e6f9f7',
          100: '#b3ede6',
          200: '#80e1d5',
          300: '#4dd5c4',
          400: '#1ac9b3',
          500: '#00bda2', // Verde azulado - crecimiento profesional
          600: '#009782',
          700: '#007161',
          800: '#004c41',
          900: '#002620',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d1117',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
