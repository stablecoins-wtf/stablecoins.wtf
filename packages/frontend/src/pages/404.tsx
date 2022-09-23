import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import {
  getSharedStaticProps,
  SharedStaticProps,
  useSharedStaticProps,
} from '@shared/getSharedStaticProps'
import { GetStaticProps } from 'next'
import React from 'react'
import { BsQuestionDiamondFill } from 'react-icons/bs'
import 'twin.macro'

export default function PageNotFound404({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)

  return (
    <>
      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="flex-grow flex flex-col" title="404 – Page Not Found">
          <div tw="flex-grow flex justify-center items-center mt-10 mb-20">
            <BsQuestionDiamondFill size={100} tw="opacity-[0.075]" />
          </div>
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
