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
export const HomeResourcesList: FC<HomeResourcesListProps> = ({ resources, ...props }) => {
  const { query, asPath: path } = useRouter()
  const [activeResource, setActiveResource] = useState<Resource | undefined>()

  // Update `activeResource` on path changes
  useEffect(() => {
    const activeResource = path.startsWith('/resources')
      ? resources?.find((r) => r.slug === query?.slug)
      : undefined
    setActiveResource(activeResource)
  }, [path, query?.slug])

  return (
    <>
      <BloombergBox title="Educational Resources" {...props}>
        <div tw="flex flex-col -mx-3 -mb-1">
          {(resources || []).map((r, idx) => (
            <Link key={r.id} href={r.getRelativeUrl()} passHref>
              <a
                css={[
                  tw`flex justify-between px-2 py-0.5 leading-5 bg-black cursor-pointer text-sm`,
                  activeResource?.id === r.id
                    ? tw`bg-white text-black`
                    : tw`text-bbg-orange hover:bg-bbg-gray3`,
                ]}
              >
                <div tw="whitespace-nowrap pb-0.5 px-1 font-semibold">
                  {idx + 1}. {r.title}
                </div>
                <div tw="hidden md:block truncate pb-0.5 pl-4 pr-1 text-bbg-gray2">/{r.slug}</div>
              </a>
            </Link>
          ))}
        </div>
      </BloombergBox>
    </>
  )
}
