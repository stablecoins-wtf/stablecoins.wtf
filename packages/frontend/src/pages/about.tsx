import { BloombergBox } from '@components/home/BloombergBox'
import { HomeContentHeader } from '@components/home/HomeContentHeader'
import { HomeLayout } from '@components/home/HomeLayout'
import { ProseWrapper } from '@components/shared/ProseWrapper'
import {
  getSharedStaticPropsFor,
  SharedStaticProps,
  SharedStatisPropsPage,
  useSharedStaticProps,
} from '@shared/getSharedStaticProps'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import 'twin.macro'

export default function HomePage({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)

  return (
    <>
      <NextSeo
        title="About stablecoins.wtf"
        description="Who is behind this crypto stablecoin dashboard? Track stablecoin market data & learn about their mechanisms on stablecoins.wtf."
      />

      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="grow" title="Educating degens about stablecoins" noHeadingMarkup={true}>
          <HomeContentHeader
            title="About stablecoins.wtf"
            subtitle="Who is behind this crypto stablecoin dashboard?"
            sharePrefix="(🪙,🪙)"
          />

          <ProseWrapper>
            <p>
              The purpose of this website is to educate degens about stablecoins. We accumulate
              quantitative live-data of major stablecoins in a single dashboard. And we aim to make
              the data understandable by everyone by providing additional educational content.
            </p>
            <p>
              Follow this project & reach out to us on{' '}
              <a href="https://twitter.com/stablecoinswtf" target="_blank">
                Twitter
              </a>
              . 💙
            </p>

            <h2>Authors</h2>
            <ul>
              <li>
                Dennis (
                <a href="https://twitter.com/dennis_zoma" target="_blank">
                  @dennis_zoma
                </a>
                ,{' '}
                <a href="https://zoma.dev" target="_blank">
                  zoma.dev
                </a>
                )
              </li>
              <li>
                Mike (
                <a href="https://twitter.com/mike1third" target="_blank">
                  @mike1third
                </a>
                )
              </li>
            </ul>

            <h2>Links</h2>
            <ul>
              <li>
                Twitter:{' '}
                <a href="https://twitter.com/stablecoinswtf" target="_blank">
                  https://twitter.com/stablecoinswtf
                </a>
              </li>
              <li>
                Github:{' '}
                <a href="https://github.com/wottpal/stablecoins.wtf" target="_blank">
                  https://github.com/wottpal/stablecoins.wtf
                </a>
              </li>
            </ul>

            <h2>Credits</h2>
            <ul>
              <li>
                The{' '}
                <a href="https://twitter.com/liamihorne/status/1525106982511845377" target="_blank">
                  original idea
                </a>{' '}
                came from liam.eth. 💡
              </li>
              <li>
                Thanks{' '}
                <a href="https://de.wikipedia.org/wiki/Michael_Bloomberg" target="_blank">
                  Michael
                </a>{' '}
                for the good ol&apos; Bloomberg Terminal which was our UI-Design inspiration. 🎨
              </li>
              <li>
                Most of the live-data is provided by{' '}
                <a href="https://www.coingecko.com/" target="_blank">
                  CoinGecko
                </a>
                ,{' '}
                <a href="https://coinmarketcap.com" target="_blank">
                  CoinMarketCap
                </a>
                , and{' '}
                <a href="https://cryptopanic.com/" target="_blank">
                  CryptoPanic
                </a>
                . 🌐
              </li>
              <li>
                Hosted on{' '}
                <a href="https://vercel.com/" target="_blank">
                  Vercel
                </a>{' '}
                with static data on{' '}
                <a href="https://hygraph.com/" target="_blank">
                  Hygraph
                </a>
                . 📂
              </li>
              <li>
                More awesome tech we used: <code>tailwindcss</code> with <code>twin.macro</code>,{' '}
                <code>recharts</code>, … 💫
              </li>
            </ul>
          </ProseWrapper>
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(SharedStatisPropsPage.ABOUT)
