import { useEffect, useState } from 'react'

export const useIsSSR = () => {
  // we always start off in "SSR mode", to ensure our initial browser render
  // matches the SSR render
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    // `useEffect` never runs on the server, so we must be on the client if
    // we hit this block
    setIsSSR(false)
  }, [])

  return isSSR
}
