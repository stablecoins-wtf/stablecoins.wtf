import { HomeAboutPage } from '@components/home/HomeAboutPage'
import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeCoinList } from '@components/home/HomeCoinList'
import { HomeHeader } from '@components/home/HomeHeader'
import { HomeStartPage } from '@components/home/HomeStartPage'
import { Coin } from '@models/Coin.model'
import { getAllCoinsAndMetadata } from '@shared/getAllCoinsAndMetadata'
import { GetStaticProps } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import 'twin.macro'

export interface HomepageProps {
  coinsData: any[]
}
export default function HomePage({ coinsData }: HomepageProps) {
  const [activeCoin, setActiveCoin] = useState<Coin>()
  const [isAboutPage, setIsAboutPage] = useState<boolean>(false)
  const [coins, setCoins] = useState<Coin[]>([])
  const detailsPageRef = useRef<HTMLDivElement>(null)

  // Initialize Coins
  useEffect(() => {
    console.log('coinsData:', coinsData)
    setCoins((coinsData || [])
      .map(Coin.fromObject)
      .filter(Boolean) as Coin[])
  }, [])

  // Navigation
  const scrollToContentSection = () => {
    const coinDetailsWrapper = detailsPageRef?.current?.children?.[0]
    const doScroll = (coinDetailsWrapper?.getBoundingClientRect()?.y || 0) > 5
    if (doScroll) coinDetailsWrapper?.scrollIntoView?.({behavior: 'smooth'})    
  }
  const activateStartPage = () => {
    setActiveCoin(undefined)
    setIsAboutPage(false)
    scrollToContentSection()
  }
  const activateAboutPage = () => {
    setActiveCoin(undefined)
    setIsAboutPage(true)
    scrollToContentSection()
  }
  const activateCoinPage = (coin: Coin) => {
    console.log('Opening details for coin:', coin)
    setActiveCoin(coin)
    setIsAboutPage(false)
    scrollToContentSection()
  }
  
  return <>
    <div tw="relative grid gap-1 p-1 lg:(grid-cols-2 h-[100vh] max-h-[100vh])">

      <div tw="flex flex-col space-y-1 lg:(max-h-full overflow-hidden)">
        <HomeHeader tw="flex-shrink-0" activateStartPage={activateStartPage} activateAboutPage={activateAboutPage} />
        <HomeCoinList tw="flex-grow" coins={coins} activateCoinPage={activateCoinPage} activeCoin={activeCoin}/>
      </div>
      
      <div tw="contents" ref={detailsPageRef}>
        {!!activeCoin
          ? <HomeCoinDetails coin={activeCoin} />
          : isAboutPage
            ? <HomeAboutPage />
            : <HomeStartPage />}
      </div>
      
    </div>
  </>
}

export const getStaticProps: GetStaticProps = getAllCoinsAndMetadata
