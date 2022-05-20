import { Resource } from '@models/Resource.model'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'


export interface HomeResourcesListProps {
  resources: Resource[]
}
export const HomeResourcesList: FC<HomeResourcesListProps> = ({resources, ...props}) => {  
  const router = useRouter()
  const { slug } = router.query
  const [activeResourceSite, setActiveResourceSite] = useState()

  // useEffect(() => {
  //   setActiveResourceSite(….find(c => c.slug === slug))
  // }, [slug])

  return <>
    <BloombergBox title="Learning Resources" {...props}>
      <div tw="flex flex-col -mx-2">
        {(resources || []).map((r, idx) => (
          <Link key={r.id} href={`/resources/${r.slug}`} passHref>
            <a tw="flex justify-between px-1 bg-black cursor-pointer hover:bg-bbg-gray3 text-sm">  
              <div tw="truncate pb-0.5 px-1 text-bbg-orange">
                {idx + 1}. {r.title}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </BloombergBox>
  </>
}
