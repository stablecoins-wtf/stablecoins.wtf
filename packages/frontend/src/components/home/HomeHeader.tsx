import { env } from '@shared/environment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import stablecoinGif from 'public/brand/stablecoin@40px.gif'
import { FC, Fragment } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeHeaderProps {}
export const HomeHeader: FC<HomeHeaderProps> = ({ ...props }) => {
  const router = useRouter()
  const actions = [
    {
      title: 'Start',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Twitter',
      href: env.twitterLink,
      isExternal: true,
    },
  ]

  const CoinLogo = () => (
    <div tw="flex items-center justify-center mr-2">
      <Image
        src={stablecoinGif}
        alt="Stablecoin-Logo of stablecoins.wtf"
        height={20}
        width={20}
        priority
      />
    </div>
  )

  return (
    <>
      <BloombergBox hideTopBar={true} tw="h-[3rem] leading-[3rem] tracking-wide" {...props}>
        <div tw="absolute inset-0 flex items-center justify-between px-2 whitespace-pre-wrap select-none">
          {/* Logo */}
          <Link href="/" passHref>
            <a tw="flex items-center font-bold">
              <CoinLogo />
              stablecoins.wtf
            </a>
          </Link>

          {/* Links */}
          <nav tw="flex items-center text-sm">
            {actions.map((action, idx) => (
              <Fragment key={idx}>
                <Link href={action.href} passHref>
                  <a
                    target={action.isExternal ? '_blank' : ''}
                    css={[tw`hover:(underline)`, router.pathname === action.href && tw`underline`]}
                  >
                    {action.title}
                  </a>
                </Link>
                {idx !== actions.length - 1 && <span tw="text-bbg-gray2">{' ⋇ '}</span>}
              </Fragment>
            ))}
          </nav>
        </div>
      </BloombergBox>
    </>
  )
}
