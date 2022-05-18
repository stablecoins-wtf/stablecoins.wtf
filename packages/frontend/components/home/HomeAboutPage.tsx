import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeAboutPageProps {}
export const HomeAboutPage: FC<HomeAboutPageProps> = () => {

  return <>
    <BloombergBox title="About stablecoins.wtf">
      <div tw="prose prose-invert  max-w-full">
        <p>The purpose is here to educate degens about stablecoins.</p>
        <h3>Authors</h3>
        <ul>
          <li>⋇ zoma.eth (<a href="https://twitter.com/dennis_zoma" target="_blank">@dennis_zoma</a>)</li>
          <li>⋇ notmike.eth (<a href="https://twitter.com/Mike2011_" target="_blank">@Mike2011_</a>)</li>
        </ul>
        <h3>Links</h3>
        <ul>
          <li>⋇ Official Website: <a href="https://stablecoins.wtf">https://stablecoins.wtf</a></li>
          <li>⋇ Twitter: <a href="https://twitter.com/stablecoinswtf">https://twitter.com/stablecoinswtf</a></li>
          <li>⋇ Github: <a href="https://github.com/wottpal/stablecoins.wtf">https://github.com/wottpal/stablecoins.wtf</a></li>
        </ul>
      </div>
    </BloombergBox>
  </>
}