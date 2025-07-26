/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        karla: ['Karla', 'sans-serif'],
      },
      keyframes: {
        'bounce-top': {
          '0%': {
            transform: 'translateY(-45px)',
            opacity: '1',
            'animation-timing-function': 'ease-in',
          },
          '24%': { opacity: '1' },
          '40%': {
            transform: 'translateY(-24px)',
            'animation-timing-function': 'ease-in',
          },
          '65%': {
            transform: 'translateY(-12px)',
            'animation-timing-function': 'ease-in',
          },
          '82%': {
            transform: 'translateY(-6px)',
            'animation-timing-function': 'ease-in',
          },
          '93%': {
            transform: 'translateY(-4px)',
            'animation-timing-function': 'ease-in',
          },
          '25%, 55%, 75%, 87%': {
            transform: 'translateY(0px)',
            'animation-timing-function': 'ease-out',
          },
          '100%': {
            transform: 'translateY(0px)',
            opacity: '1',
            'animation-timing-function': 'ease-out',
          },
        },
        'color-change-5x': {
          '0%': { background: '#19dcea' },
          '25%': { background: '#b22cff' },
          '50%': { background: '#ea2222' },
          '75%': { background: '#f5be10' },
          '100%': { background: '#3bd80d' },
        },
         'scale-in-ver-top': {
            '0%': {
                transform: 'scaleY(0)',
                transformOrigin: '100% 0%',
                opacity: '1',
            },
            '100%': {
                transform: 'scaleY(1)',
                transformOrigin: '100% 0%',
                opacity: '1',
            },
        }
      },
      animation: {
        'bounce-top': 'bounce-top 0.9s both',
        'color-change': 'color-change-5x 8s linear infinite alternate both',
        'scale-in-ver-top': 'scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
  },
    },
  plugins: [],
}
