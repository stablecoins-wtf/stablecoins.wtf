import { env } from '@shared/environment'
import Image from 'next/image'
import stablecoinGif from 'public/brand/stablecoin.gif'
import { FC, Fragment } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeHeaderProps {
  activateStartPage: () => void
  activateAboutPage: () => void
}
export const HomeHeader: FC<HomeHeaderProps> = ({activateStartPage, activateAboutPage}) => {
  const actions = [
    {
      title: 'Start',
      onClick: activateStartPage,
    },
    {
      title: 'About',
      onClick: activateAboutPage,
    },
    {
      title: 'Twitter',
      href: env.twitterLink,
      isExternal: true,
    },
  ]

  const CoinLogo = () => (
    <div tw="flex items-center justify-center mr-2">
      <Image src={stablecoinGif} alt="Animated Logo of stablecoins.wtf" height={18} width={18}/>
    </div>
  )

  return <>
    <BloombergBox tw="h-[3rem] leading-[3rem] tracking-wide" hideTopBar={true}>
      <div tw="absolute inset-0 flex justify-between px-2  whitespace-pre-wrap select-none">
        {/* <Marquee gradient={false} speed={50} pauseOnHover={true} tw="whitespace-pre-wrap"> */}

        {/* Logo */}
        <div tw="flex items-center font-bold">
          <CoinLogo />stablecoins.wtf
        </div>

        {/* Links */}
        <div tw="flex">
          {actions.map((action, idx) => (
            <Fragment key={idx}>
              {!!action.onClick
                ? <button onClick={action.onClick} tw="hover:(underline)">
                  {action.title}
                </button>
                : <a target={action.isExternal ? '_blank' : ''} href={action.href} tw="hover:(underline)">
                  {action.title}
                </a>}
              {(idx !== actions.length - 1) && <span tw="text-bbg-gray2">{' ⋇ '}</span>}
            </Fragment>
          ))}
        </div>
          
        {/* </Marquee> */}
      </div>
    </BloombergBox>
  </>
}