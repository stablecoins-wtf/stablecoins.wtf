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
  const actions: {
    title: string
    href: string
    isExternal?: boolean
  }[] = [
    {
      title: 'Start',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
  ]

  const CoinLogo = () => (
    <div tw="flex items-center justify-center mr-2.5 mt-px">
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
      <BloombergBox hideTopBar={true} {...props}>
        <div tw="flex items-center justify-between leading-none">
          {/* Logo */}
          <Link href="/" tw="flex items-center font-bold tracking-wide select-none">
            <CoinLogo />
            stablecoins.wtf
          </Link>

          {/* Links */}
          <nav tw="flex items-center font-medium text-sm -mx-2">
            {actions.map((action, idx) => (
              <Fragment key={idx}>
                <Link
                  href={action.href}
                  target={action.isExternal ? '_blank' : ''}
                  css={[
                    tw`px-1 py-1 mx-2 leading-none underline-offset-2 hover:(underline)`,
                    router.pathname === action.href && tw`underline`,
                  ]}
                >
                  {action.title}
                </Link>
                {idx !== actions.length - 1 && <span tw="text-bbg-gray2">⋇</span>}
              </Fragment>
            ))}
          </nav>
        </div>
      </BloombergBox>
    </>
  )
}
