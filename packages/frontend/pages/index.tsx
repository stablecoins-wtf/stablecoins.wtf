import { gql } from '@apollo/client'
import { BloombergBox } from '@components/home/BloombergBox'
import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeHeader } from '@components/home/HomeHeader'
import { Coin } from '@models/Coin.model'
import { apolloClient } from '@shared/apolloClient'
import React, { Fragment, useEffect, useState } from 'react'
import 'twin.macro'

export interface HomepageProps {
  coinsData: any[]
}
export default function HomePage({ coinsData }: HomepageProps) {
  const [activeCoin, setActiveCoin] = useState<Coin>()
  const [coins, setCoins] = useState<Coin[]>([])

  // Initialize Coins
  useEffect(() => {
    console.log({coinsData})
    setCoins((coinsData || [])
      .map(Coin.fromObject)
      .filter(Boolean) as Coin[])
  }, [])
  
  return <>
    <div tw="grid md:grid-cols-2 gap-1 p-1 h-full">

      <div tw="flex flex-col space-y-1">
        <HomeHeader />
        <BloombergBox tw="flex-1">
          {coins.map(coin => <Fragment key={coin.id}>
            <div tw="flex justify-between hover:bg-bbg-gray2 cursor-pointer" onClick={() => {setActiveCoin(coin)}}>
              <span>{coin.name}</span>
              <span>{coin.symbol}</span>
              <span>{coin.address}</span>
            </div>
          </Fragment>)}
        </BloombergBox>
      </div>
      
      {!!activeCoin
        ? <HomeCoinDetails coin={activeCoin} />
        : <BloombergBox>Select a coin…</BloombergBox>}
      
    </div>
  </>
}

export async function getStaticProps() {
  const { data } = await apolloClient.query({
    query: gql`
      query Coins {
        coins {
          id
          name
          symbol
          slug
          address
          body
        }
      }
    `,
  })

  return {
    props: {
      coinsData: data.coins,
    },
  }
}