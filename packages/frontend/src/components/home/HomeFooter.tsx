import { Article } from '@models/Article.model'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeFooterProps {
  legal: Article[]
}
export const HomeFooter: FC<HomeFooterProps> = ({ legal, ...props }) => {
  return (
    <>
      <BloombergBox hideTopBar={true} {...props}>
        <div tw="grid justify-center space-y-1.5 text-center sm:(grid-cols-2 space-y-0 space-x-1 justify-between text-left) leading-4 text-xs text-bbg-gray1">
          <div tw="whitespace-nowrap">© {dayjs().year()} • No Financial Advice</div>
          <div tw="flex flex-wrap justify-end space-x-3.5">
            {legal.map((l) => (
              <Link
                key={l.slug}
                href={l.getRelativeUrl()}
                prefetch={false}
                tw="whitespace-nowrap underline-offset-2 hover:(underline text-white)"
              >
                {l.title}
              </Link>
            ))}
          </div>
        </div>
      </BloombergBox>
    </>
  )
}
