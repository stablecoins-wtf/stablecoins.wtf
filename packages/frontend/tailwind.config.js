
module.exports = {
  content: [
    `./pages/**/*.{js,ts,jsx,tsx}`,
    `./components/**/*.{js,ts,jsx,tsx}`
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
          twitter: '#1DA1F2',
          discord: '#EB459E',
        },
      },
      fontFamily: {
        display: ['Arial', 'serif'],
        mono: ['Inconsolata', 'Menlo', 'monospace'],
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
