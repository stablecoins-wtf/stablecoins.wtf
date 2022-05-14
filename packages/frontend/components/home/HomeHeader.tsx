import { env } from '@shared/environment'
import Image from 'next/image'
import stablecoinGif from 'public/brand/stablecoin.gif'
import { FC, Fragment } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

const links = [
  {
    title: 'About',
    href: '#about',
  },
  {
    title: 'Twitter',
    href: env.twitterLink,
    isExternal: true,
  },
]


export const HomeHeader: FC = () => {
  const CoinLogo = () => (
    <div tw="flex items-center justify-center mr-2">
      <Image src={stablecoinGif} alt="Animated Logo of stablecoins.wtf" height={18} width={18}/>
    </div>
  )

  return <>
    <BloombergBox tw="h-[3rem] leading-[3rem] tracking-wide">
      <div tw="absolute inset-0 flex justify-between px-2  whitespace-pre-wrap select-none">
        {/* <Marquee gradient={false} speed={50} pauseOnHover={true} tw="whitespace-pre-wrap"> */}

        {/* Logo */}
        <div tw="flex items-center font-bold">
          <CoinLogo />stablecoins.wtf
        </div>

        {/* Links */}
        <div tw="flex">
          {links.map((link, idx) => (
            <Fragment key={idx}>
              <a target={link.isExternal ? '_blank' : ''} href={link.href}
                tw="flex items-center hover:(underline)">
                <span>{link.title}</span>
              </a>
              {(idx !== links.length - 1) && <span tw="text-bbg-gray2">{' ⋇ '}</span>}
            </Fragment>
          ))}
        </div>
          
        {/* </Marquee> */}
      </div>
    </BloombergBox>
  </>
}