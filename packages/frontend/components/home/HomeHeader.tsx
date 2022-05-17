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
export const HomeHeader: FC<HomeHeaderProps> = ({activateStartPage, activateAboutPage, ...props}) => {
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
      <Image src={stablecoinGif} alt="Animated Logo of stablecoins.wtf" height={20} width={20}/>
    </div>
  )

  return <>
    <BloombergBox hideTopBar={true} tw="h-[3rem] leading-[3rem] tracking-wide overflow-hidden" {...props}>
      <div tw="absolute inset-0 flex items-center justify-between px-2 whitespace-pre-wrap select-none">

        {/* Logo */}
        <div tw="flex items-center font-bold">
          <CoinLogo />stablecoins.wtf
        </div>

        {/* Links */}
        <div tw="flex items-center text-sm">
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
          
      </div>
    </BloombergBox>
  </>
}