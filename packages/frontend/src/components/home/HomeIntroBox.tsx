import Link from 'next/link'
import { FC } from 'react'
import { useCookies } from 'react-cookie'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeIntroBoxProps {}
export const HomeIntroBox: FC<HomeIntroBoxProps> = () => {
  const [_, setCookie] = useCookies(['hide-intro'])

  return (
    <>
      <BloombergBox
        title="WTF! Where to start?"
        isClosable={true}
        onClosed={() => {
          setCookie('hide-intro', 'true')
        }}
      >
        <ul tw="text-sm text-bbg-gray1 flex flex-col space-y-1.5 mb-1">
          <li>→ Select a coin in the table to get more details 🪙</li>
          <li>
            → Study our educational content about stablecoins
            <span tw="hidden lg:inline"> (lower left)</span> 📚
          </li>
          <li>
            →{' '}
            <Link href="/about" tw="font-bold underline-offset-2 hover:underline">
              Learn more about this project
            </Link>{' '}
            ℹ️
          </li>
        </ul>
      </BloombergBox>
    </>
  )
}
