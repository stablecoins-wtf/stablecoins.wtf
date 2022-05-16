import { HomeAboutPage } from '@components/home/HomeAboutPage'
import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeCoinList } from '@components/home/HomeCoinList'
import { HomeHeader } from '@components/home/HomeHeader'
import { HomeStartPage } from '@components/home/HomeStartPage'
import { Coin } from '@models/Coin.model'
import { getAllCoinsAndMetadata } from '@shared/getAllCoinsAndMetadata'
import { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'
import 'twin.macro'

export interface HomepageProps {
  coinsData: any[]
}
export default function HomePage({ coinsData }: HomepageProps) {
  const [activeCoin, setActiveCoin] = useState<Coin>()
  const [isAboutPage, setIsAboutPage] = useState<boolean>(false)
  const [coins, setCoins] = useState<Coin[]>([])

  // Initialize Coins
  useEffect(() => {
    setCoins((coinsData || [])
      .map(Coin.fromObject)
      .filter(Boolean) as Coin[])
  }, [])

  // Navigation
  const activateStartPage = () => {
    setActiveCoin(undefined)
    setIsAboutPage(false)
  }
  const activateAboutPage = () => {
    setActiveCoin(undefined)
    setIsAboutPage(true)
  }
  const activateCoinPage = (coin: Coin) => {
    setActiveCoin(coin)
    setIsAboutPage(false)
  }
  
  return <>
    <div tw="grid md:grid-cols-2 gap-1 p-1 h-full">

      <div tw="flex flex-col space-y-1">
        <HomeHeader activateStartPage={activateStartPage} activateAboutPage={activateAboutPage} />
        <HomeCoinList coins={coins} activateCoinPage={activateCoinPage} activeCoin={activeCoin}/>
      </div>
      
      {!!activeCoin
        ? <HomeCoinDetails coin={activeCoin} />
        : isAboutPage
          ? <HomeAboutPage />
          : <HomeStartPage />}
      
    </div>
  </>
}

export const getStaticProps: GetStaticProps = getAllCoinsAndMetadata
