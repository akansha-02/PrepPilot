/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F2F3EE',
          deep: '#E9EBE4'
        },
        sheet: {
          DEFAULT: '#FBFBF8'
        },
        ink: {
          DEFAULT: '#191B20',
          soft: '#3A3D44',
          muted: '#5F6560',
          faint: '#8B908A'
        },
        line: {
          DEFAULT: '#DDDFD5',
          strong: '#B9BCAF'
        },
        marker: {
          DEFAULT: '#F2E55A',
          deep: '#E3D22F'
        },
        danger: {
          DEFAULT: '#B42318',
          soft: '#FBEDEB'
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        sheet: '0 1px 2px rgba(25, 27, 32, 0.06)',
        lift: '0 12px 32px rgba(25, 27, 32, 0.10)'
      }
    }
  },
  plugins: []
};
