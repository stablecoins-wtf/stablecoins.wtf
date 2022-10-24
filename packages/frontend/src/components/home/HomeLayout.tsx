import { HomeCoinList } from '@components/home/HomeCoinList'
import { HomeHeader } from '@components/home/HomeHeader'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import { useRouter } from 'next/router'
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import 'twin.macro'
import { HomeArticlesList } from './HomeArticlesList'
import { HomeFollowBar } from './HomeFollowBar'
import { HomeFooter } from './HomeFooter'
import { HomeResourcesList } from './HomeResourcesList'

export interface HomeLayoutProps extends ParsedSharedStaticProps {}
export const HomeLayout: FC<PropsWithChildren<HomeLayoutProps>> = ({
  coins,
  articles,
  resources,
  legal,
  children,
}) => {
  const { asPath: path } = useRouter()
  const [isHome] = useState(path === '/')
  const detailsPageRef = useRef<HTMLDivElement>(null)

  // Scroll to main area (esp. helpful on mobile)
  useEffect(() => {
    if (isHome) return
    detailsPageRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [path])

  return (
    <>
      <main tw="grow grid gap-1 p-1 lg:(grid-cols-2 h-[100vh] max-h-[100vh] relative)">
        {isHome && <h1 tw="sr-only">stablecoins.wtf – Crypto Stablecoin Dashboard & Resources</h1>}

        <div
          ref={detailsPageRef}
          tw="order-1 grow-0 flex flex-col space-y-1 relative overflow-hidden"
        >
          <HomeFollowBar tw="shrink-0" {...{ legal }} />
          {children}
          <HomeFooter tw="shrink-0" {...{ legal }} />
        </div>

        <div tw="flex flex-col space-y-1 max-w-[calc(100vw - 0.5rem)] lg:(max-h-full overflow-hidden)">
          <HomeHeader tw="shrink-0" />
          <HomeCoinList tw="grow max-h-[42vh] lg:max-h-[none]" coins={coins} />
          <HomeResourcesList tw="shrink-0" {...{ resources }} />
          <HomeArticlesList tw="shrink-0" {...{ articles }} />
        </div>
      </main>
    </>
  )
}
