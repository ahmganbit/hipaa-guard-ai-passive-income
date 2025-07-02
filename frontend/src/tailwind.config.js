/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': {
          50: '#f8f6ff',
          100: '#f0ebff',
          200: '#e4d9ff',
          300: '#d1bfff',
          400: '#b899ff',
          500: '#9d6eff',
          600: '#8b47ff',
          700: '#7c2dff',
          800: '#6b1adb',
          900: '#4a0e99',
          950: '#2d0866',
        },
        'brand-gold': {
          50: '#fffef0',
          100: '#fffadb',
          200: '#fff2b8',
          300: '#ffe685',
          400: '#ffd652',
          500: '#ffc220',
          600: '#f0a500',
          700: '#cc8500',
          800: '#a66a00',
          900: '#8a5a00',
        },
        'brand-teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
