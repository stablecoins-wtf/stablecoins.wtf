import { FC } from 'react'
import 'twin.macro'

export const ProseWrapper: FC = ({children, ...props}) => {
  return <>
    <div className="prose prose-invert max-w-full prose-p:text-justify prose-ul:list-['⋇'] prose-h3:mt-2 prose-img:mx-auto prose-img:border prose-img:border-bbg-gray3 prose-img:p-2" {...props}>
      {children}
    </div>
  </>
}