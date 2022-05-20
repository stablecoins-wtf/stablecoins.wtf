import { HomeCoinList } from '@components/home/HomeCoinList'
import { HomeHeader } from '@components/home/HomeHeader'
import { Coin } from '@models/Coin.model'
import { Resource } from '@models/Resource.model'
import { FC, useRef, useState } from 'react'
import 'twin.macro'
import { HomeResourcesList } from './HomeResourcesList'


export interface HomeLayoutProps {
  coins: Coin[]
  resources: Resource[]
}
export const HomeLayout: FC<HomeLayoutProps> = ({ coins, resources, children }) => {
  const [activeCoin, setActiveCoin] = useState<Coin>()
  const detailsPageRef = useRef<HTMLDivElement>(null)

  return <>
    <main tw="flex-grow grid gap-1 p-1 lg:(grid-cols-2 h-[100vh] max-h-[100vh])">

      <div tw="flex flex-col space-y-1 lg:(max-h-full overflow-hidden)">
        <HomeHeader tw="flex-shrink-0" activateStartPage={() => {}} activateAboutPage={() => {}} />
        <HomeResourcesList resources={resources} />
        <HomeCoinList tw="flex-grow" coins={coins} />
      </div>

      <div tw="contents" ref={detailsPageRef}>
        {children}
      </div>

    </main>
  </>
}