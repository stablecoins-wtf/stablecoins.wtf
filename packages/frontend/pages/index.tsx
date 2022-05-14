import { BloombergBox } from '@components/home/BloombergBox'
import { HomeHeader } from '@components/home/HomeHeader'
import React from 'react'
import 'twin.macro'

export default function HomePage() {
  return <>
    
    <div tw="grid md:grid-cols-2 gap-1 p-1 h-full">

      <div tw="flex flex-col space-y-1">
        <HomeHeader />
        <BloombergBox tw="flex-1">
          Table
        </BloombergBox>
      </div>
      
      <BloombergBox>
          Coin Details
      </BloombergBox>

    </div>
  
  </>
}

