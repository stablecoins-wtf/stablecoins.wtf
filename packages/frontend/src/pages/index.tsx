import { HomeLayout } from '@components/home/HomeLayout'
import { HomeStartPage } from '@components/home/HomeStartPage'
import {
  getSharedStaticProps,
  SharedStaticProps,
  useSharedStaticProps,
} from '@shared/getSharedStaticProps'
import { GetStaticProps } from 'next'
import React from 'react'
import 'twin.macro'

export interface HomePageProps extends SharedStaticProps {}
export default function HomePage({ ...props }: HomePageProps) {
  const sharedStaticProps = useSharedStaticProps(props)

  return (
    <>
      <HomeLayout {...sharedStaticProps}>
        <HomeStartPage {...sharedStaticProps} />
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
