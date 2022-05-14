
module.exports = {
  content: [`./pages/**/*.{js,ts,jsx,tsx}`, `./components/**/*.{js,ts,jsx,tsx}`],
  theme: {
    extend: {
      colors: {
        bbg: {
          orange: '#ff9700',
          red1: '#ff0034',
          red2: '#ce0026',
          green1: '#00f360',
          green2: '#00ab44',
          gray1: '#979b9a',
          gray2: '#555555',
          gray3: '#1c1c1c',
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
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/line-clamp'),
  ],
}
