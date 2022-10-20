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
        <div tw="flex justify-between items-end space-x-1 leading-4 text-xs text-bbg-gray2">
          {/* <div>© {dayjs().year()} Scio Labs UG. All Rights Reserved.</div> */}
          <div tw="whitespace-nowrap">© {dayjs().year()} • No Financial Advice</div>
          <div tw="flex flex-wrap justify-end space-x-4">
            {legal.map((l) => (
              <Link key={l.slug} href={`/legal/${l.slug}`} passHref>
                <a tw="whitespace-nowrap font-bold hover:(underline text-white)">{l.title}</a>
              </Link>
            ))}
          </div>
        </div>
      </BloombergBox>
    </>
  )
}
