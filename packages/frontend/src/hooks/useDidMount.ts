import { useEffect, useRef } from 'react'

// Source: https://stackoverflow.com/a/55409573/1381666
export function useDidMount() {
  const mountRef = useRef(false)

  useEffect(() => {
    mountRef.current = true
  }, [])

  return () => mountRef.current
}
