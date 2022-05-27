import { Global } from '@emotion/react'
import 'nprogress/nprogress.css'
import React from 'react'
import 'react-tippy/dist/tippy.css'
import tw, { css, GlobalStyles as BaseStyles } from 'twin.macro'

const customStyles = css`
  html {
    scroll-behavior:smooth;
  }
  body {
    ${tw`antialiased bg-black text-white font-mono`}
    font-variant-ligatures: no-common-ligatures;
  }
  #__next {
    ${tw`min-h-screen h-screen relative flex flex-col`}
  }
  #nprogress > .bar {
    ${tw`bg-white`}
  }
  #nprogress > .spinner {
    ${tw`hidden!`}
  }
  .tippy-tooltip {
    ${tw`bg-bbg-gray2 bg-opacity-90 text-white text-sm px-2 py-1.5 rounded-none`},
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
