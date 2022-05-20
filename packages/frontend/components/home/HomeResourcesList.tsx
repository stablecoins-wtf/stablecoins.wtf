import { Resource } from '@models/Resource.model'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import { BloombergBox } from './BloombergBox'


export interface HomeResourcesListProps {
  resources: Resource[]
}
export const HomeResourcesList: FC<HomeResourcesListProps> = ({resources, ...props}) => {  
  const router = useRouter()
  const { slug } = router.query
  const [activeResource, setActiveResource] = useState<Resource>()

  useEffect(() => {
    setActiveResource(resources.find(r => r.slug === slug))
  }, [slug])

  return <>
    <BloombergBox title="Learning Resources" {...props}>
      <div tw="flex flex-col -mx-2">
        {(resources || []).map((r, idx) => (
          <Link key={r.id} href={`/resources/${r.slug}`} passHref>
            <a css={[
              tw`flex justify-between px-1 bg-black cursor-pointer text-sm`,
              activeResource?.id === r.id ? tw`bg-white text-black font-semibold` : tw`text-bbg-orange hover:bg-bbg-gray3`,
            ]}>
              <div tw="truncate pb-0.5 px-1">
                {idx + 1}. {r.title}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </BloombergBox>
  </>
}
