import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import { useCoinsData } from '@hooks/useCoinsData'
import { CoinsDataProps, getAllCoinsAndMetadata } from '@shared/getAllCoinsAndMetadata'
import { GetStaticProps } from 'next'
import React from 'react'
import { BsQuestionDiamondFill } from 'react-icons/bs'
import 'twin.macro'

export default function PageNotFound404({ coinsData }: CoinsDataProps) {
  const {coins} = useCoinsData(coinsData)
  
  return <>
    <HomeLayout coins={coins}>
      <BloombergBox tw="flex-grow flex flex-col" title="404 – Page Not Found">
        <div tw="flex-grow flex justify-center items-center mt-10 mb-20">
          <BsQuestionDiamondFill size={100} tw="opacity-[0.075]"  />
        </div>
      </BloombergBox>
    </HomeLayout>
  </>
}

export const getStaticProps: GetStaticProps = getAllCoinsAndMetadata
