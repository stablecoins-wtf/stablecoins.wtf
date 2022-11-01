import Link from 'next/link'
import { FC } from 'react'
import { FaDiscord, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import 'twin.macro'
import { theme } from 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeFollowBarProps {}
export const HomeFollowBar: FC<HomeFollowBarProps> = ({ ...props }) => {
  const items = [
    {
      titlePrefix: 'Subscribe to ',
      title: 'Telegram',
      icon: FaTelegramPlane,
      href: 'https://t.me/stablecoinswtf',
      color: theme('colors.social.telegram'),
    },
    {
      titlePrefix: 'Follow on ',
      title: 'Twitter',
      icon: FaTwitter,
      href: 'https://twitter.com/stablecoinswtf',
      color: theme('colors.social.twitter'),
    },
    {
      titlePrefix: 'Discuss on ',
      title: 'Discord',
      icon: FaDiscord,
      href: 'https://discord.gg/kKnJ5WHVmh',
      color: theme('colors.social.discord'),
    },
  ]

  return (
    <>
      <BloombergBox hideTopBar={true} {...props}>
        <div tw="flex -my-2 -mx-3 leading-none text-sm divide-x divide-bbg-gray3">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              target="_blank"
              className="group"
              tw="flex-1 flex justify-center items-center space-x-2 py-3 whitespace-nowrap hover:(bg-bbg-gray3)"
            >
              <div tw="font-medium text-white underline-offset-2 group-hover:(underline)">
                <span tw="hidden sm:(inline) lg:(hidden) xl:(inline)">{item.titlePrefix}</span>
                {item.title}
              </div>
              <item.icon tw="h-3 w-3" style={{ color: item.color }} />
            </Link>
          ))}
        </div>
      </BloombergBox>
    </>
  )
}
