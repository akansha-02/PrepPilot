/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07111f',
          900: '#0b1727',
          800: '#122238',
          700: '#1d324f'
        },
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#b3deff',
          300: '#82c7ff',
          400: '#4ea7ff',
          500: '#2c8cff',
          600: '#146df5',
          700: '#1258c8'
        },
        accent: {
          50: '#fdf7ef',
          100: '#faecd6',
          200: '#f5d3a9',
          300: '#eeab6a',
          400: '#e87f33',
          500: '#dc6514'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(3, 9, 18, 0.12)',
        glow: '0 0 0 1px rgba(77, 167, 255, 0.16), 0 24px 60px rgba(20, 109, 245, 0.22)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(20,109,245,0.22), transparent 30%), radial-gradient(circle at right, rgba(220,101,20,0.18), transparent 28%), linear-gradient(180deg, #06101c 0%, #0b1727 45%, #f6f9fc 45%, #f6f9fc 100%)'
      }
    }
  },
  plugins: []
};