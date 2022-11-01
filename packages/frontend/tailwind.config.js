/* eslint-disable */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        bbg: {
          orange: '#ff9700',
          red1: '#ff0034',
          red2: '#ce0026',
          green1: '#00f360',
          green2: '#00ab44',
          blue1: '#0080d6',
          blue2: '#54789c',
          gray1: '#979b9a',
          gray2: '#646464',
          gray3: '#282828',
          cyan: '#00e5e4',
        },
        social: {
          twitter: '#1da1f2',
          discord: '#7289da',
          telegram: '#0088cc',
        },
      },
      fontSize: {
        xs: '0.8rem',
        sm: '0.9rem',
      },
      fontFamily: {
        display: ['Arial', 'serif'],
        mono: ['Inconsolata', 'Menlo', 'monospace'],
      },
      animation: {
        'spin-custom': '800ms ease-in-out infinite spin',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'),
  ],
}
