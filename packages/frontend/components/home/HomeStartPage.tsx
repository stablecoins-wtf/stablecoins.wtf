import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeStartPageProps {}
export const HomeStartPage: FC<HomeStartPageProps> = () => {

  return <>
    <BloombergBox title="Select coin…">
      <div tw="flex items-center justify-center mt-5">
        <div>
        This a work-in-progress hackathon project by <a tw="font-bold" href="https://twitter.com/dennis_zoma" target="_blank">@dennis_zoma</a> & <a tw="font-bold" href="https://twitter.com/mike1third" target="_blank">@mike1third</a> to educate degens about stablecoins.
          <br/><br/>Follow the project on <a tw="font-bold" href="https://twitter.com/stablecoinswtf" target="_blank">@stablecoinswtf</a> to be notified when we launch.
        </div>
      </div>      
    </BloombergBox>
  </>
}