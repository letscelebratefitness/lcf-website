/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5A1E5C',
          dark: '#3E1240',
          light: '#EFE6F2',
          50: '#f9f0fa',
          100: '#EFE6F2',
          200: '#d9b8de',
          300: '#c389c8',
          400: '#a85aab',
          500: '#7d3080',
          600: '#5A1E5C',
          700: '#3E1240',
          800: '#2a0d2b',
          900: '#160716',
        },
        accent: {
          DEFAULT: '#F2C94C',
          light: '#fdf3cc',
          dark: '#d4a017',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(90, 30, 92, 0.08)',
        'card': '0 4px 24px rgba(90, 30, 92, 0.10)',
        'hover': '0 8px 32px rgba(90, 30, 92, 0.16)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
