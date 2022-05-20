import { HomeAboutPage } from '@components/home/HomeAboutPage'
import { HomeLayout } from '@components/home/HomeLayout'
import { getSharedStaticProps, SharedStaticProps, useSharedStaticProps } from '@shared/getSharedStaticProps'
import { GetStaticProps } from 'next'
import React from 'react'
import 'twin.macro'

export default function HomePage({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)
  
  return <>
    <HomeLayout {...sharedStaticProps}>
      <HomeAboutPage />
    </HomeLayout>
  </>
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
