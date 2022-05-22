import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import { ProseWrapper } from '@components/ProseWrapper'
import { getSharedStaticProps, SharedStaticProps, useSharedStaticProps } from '@shared/getSharedStaticProps'
import { GetStaticProps } from 'next'
import React from 'react'
import 'twin.macro'

export default function HomePage({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)
  
  return <>
    <HomeLayout {...sharedStaticProps}>
      <BloombergBox title="Educating degens about stablecoins">
        <ProseWrapper>
          <h3>About stablecoins.wtf</h3>
          <p>
            The purpose of this page is to educate degens about stablecoins.
            We accumulate quantitative live-data of major stablecoins in a single dashboard.
            And we aim to make the data understandable by everyone by providing additional educational content.
            {' '}<a href="https://twitter.com/stablecoinswtf" target="_blank">Follow this project on Twitter</a> for more information.
          </p>
          <p>
            This project originated as a hackathon submission for <a href="https://hackathon.money/" target="_blank">HackMoney</a> 2022.
          </p>

          <h4>Authors:</h4>
          <ul>
            <li>zoma.eth (<a href="https://twitter.com/dennis_zoma" target="_blank">@dennis_zoma</a>)</li>
            <li>Mike (<a href="https://twitter.com/mike1third" target="_blank">@mike1third</a>)</li>
          </ul>

          <h4>Links:</h4>
          <ul>
            <li>Twitter: <a href="https://twitter.com/stablecoinswtf" target="_blank">https://twitter.com/stablecoinswtf</a></li>
            <li>Github: <a href="https://github.com/wottpal/stablecoins.wtf" target="_blank">https://github.com/wottpal/stablecoins.wtf</a></li>
          </ul>
          
          
          <h4>Credits:</h4>
          <ul>
            <li>The <a href="https://twitter.com/liamihorne/status/1525106982511845377" target="_blank">original idea</a> came from liam.eth 💡</li>
            <li>Thanks for the feedback and some great ideas, <a href="https://twitter.com/dmihal" target="_blank">@dmihal</a>. In the next weeks we aim to have all our data provided by public open-source CryptoStats adapters. 📊</li>
            <li>Thanks <a href="https://de.wikipedia.org/wiki/Michael_Bloomberg" target="_blank">Michael</a> for the good ol' Bloomberg Terminal which was our UI-Design inspiration. 🎨</li>
            <li>Most of the live-data is provided by <a href="https://www.coingecko.com/" target="_blank">CoinGecko</a>, <a href="https://coinmarketcap.com" target="_blank">CoinMarketCap</a>, and <a href="https://cryptopanic.com/" target="_blank">CryptoPanic</a>. 🌐</li>
            <li>Hosted on <a href="https://vercel.com/" target="_blank">Vercel</a> with static data on <a href="https://graphcms.com/" target="_blank">GraphCMS</a>. 📂</li>
            <li>More awesome tech we used: <code>tailwindcss</code> with <code>twin.macro</code>, <code>recharts</code>, … 💫</li>
          </ul>
        </ProseWrapper>
      </BloombergBox>
    </HomeLayout>
  </>
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
