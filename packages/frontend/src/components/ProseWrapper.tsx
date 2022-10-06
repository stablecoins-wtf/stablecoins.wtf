import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export const ProseWrapper: FC<PropsWithChildren> = ({ children, ...props }) => {
  return (
    <>
      <div
        tw="prose prose-invert max-w-full px-2 py-1
    prose-p:(text-justify)
    prose-ul:(list-['⋇'])
    prose-h2:(mt-2.5)
    prose-h3:(mt-1.5)
    prose-img:(mx-auto border border-bbg-gray3 p-2)"
        {...props}
      >
        {children}
      </div>
    </>
  )
}
