import { FC } from 'react'
import 'twin.macro'

export const ProseWrapper: FC = ({children, ...props}) => {
  return <>
    <div tw="prose prose-invert max-w-full 
    prose-p:(text-justify)
    prose-ul:(list-['⋇'])
    prose-h3:(mt-2)
    prose-img:(mx-auto border border-bbg-gray3 p-2)"
    {...props}>
      {children}
    </div>
  </>
}