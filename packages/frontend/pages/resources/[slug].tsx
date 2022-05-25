import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import { ProseWrapper } from '@components/ProseWrapper'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { fetchOrGetResources } from '@shared/getAllResources'
import { getSharedStaticProps, SharedStaticProps, useSharedStaticProps } from '@shared/getSharedStaticProps'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PageNotFound404 from 'pages/404'
import React from 'react'
import 'twin.macro'

export default function HomePage({...props}: SharedStaticProps) {
  const router = useRouter()
  const {coins, resources} = useSharedStaticProps(props)
  const { slug } = router.query
  const resource = resources.find(r => r.slug === slug)
  if (!resource) return <PageNotFound404 {...props} />

  return <>
    <NextSeo
      title={resource.title}
      description={resource.subtitle || 'Research and educational content about stablecoins'}
    />

    <HomeLayout coins={coins} resources={resources}>
      <BloombergBox tw="flex-1" title={resource.subtitle || resource.title}>
        {resource.content &&
          <ProseWrapper>
            <RichText content={resource.content} />
          </ProseWrapper>
        }
      </BloombergBox>
    </HomeLayout>
  </>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const resourcesData = await fetchOrGetResources()
  const paths = (resourcesData || [])
    .filter((resourceData: any) => !!resourceData?.slug)
    .map((resourceData: any) => ({
      params: { slug: resourceData.slug }
    }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
