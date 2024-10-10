import { Article } from '@models/Article.model'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'
import { FaGlobe, FaNetworkWired } from 'react-icons/fa'

export interface HomePartnerSitesProps {

}
export const HomePartnerSites: FC<HomePartnerSitesProps> = ({ ...props }) => {
  return (
    <>
      <BloombergBox hideTopBar={true} {...props}>
        <div tw="flex font-semibold gap-5 text-center sm:(text-right justify-between) items-center leading-4 text-xs text-bbg-gray1">
          <FaGlobe size={12} tw="hidden sm:block" />
          <div tw="flex flex-wrap w-full sm:w-auto text-center justify-center sm:(justify-end text-right) gap-3.5">
            <Link href="https://scio.xyz">Scio.xyz</Link>
            <Link href="https://elivate.ai">Elivate.ai</Link>
            <Link href="https://zoma.dev">Zoma.dev</Link>
            <Link href="https://cruise.wiki">Cruise.wiki</Link>
            <Link href="https://find-your-cruise.com">Find your Cruise</Link>
            <Link href="https://finde-deine-kreuzfahrt.de">Finde deine Kreuzfahrt</Link>
          </div>
        </div>
      </BloombergBox>
    </>
  )
}
