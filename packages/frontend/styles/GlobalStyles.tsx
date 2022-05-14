import { Global } from '@emotion/react'
import 'nprogress/nprogress.css'
import React from 'react'
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
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
