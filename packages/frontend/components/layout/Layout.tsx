import { FC } from 'react'
import 'twin.macro'

export const Layout: FC = ({ children }) => {

  return <>
    <main tw="flex-grow">
      {children}
    </main>
  </>
}