import { HomeCoinList } from '@components/home/HomeCoinList'
import { HomeHeader } from '@components/home/HomeHeader'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import { useRouter } from 'next/router'
import { FC, PropsWithChildren, useRef } from 'react'
import 'twin.macro'
import { HomeArticlesList } from './HomeArticlesList'
import { HomeResourcesList } from './HomeResourcesList'

export interface HomeLayoutProps extends ParsedSharedStaticProps {}
export const HomeLayout: FC<PropsWithChildren<HomeLayoutProps>> = ({
  coins,
  resources,
  articles,
  children,
}) => {
  const { pathname } = useRouter()
  const isHome = pathname === '/'
  const detailsPageRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <main tw="grow grid gap-1 p-1 lg:(grid-cols-2 h-[100vh] max-h-[100vh] relative)">
        {isHome && <h1 tw="sr-only">stablecoins.wtf – Crypto Stablecoin Dashboard & Resources</h1>}

        <div ref={detailsPageRef} tw="order-1 grow-0 flex flex-col relative overflow-hidden">
          {children}
        </div>

        <div tw="flex flex-col space-y-1 max-w-[calc(100vw - 0.5rem)] lg:(max-h-full overflow-hidden)">
          <HomeHeader tw="shrink-0" />
          <HomeCoinList tw="grow max-h-[42vh] lg:max-h-[none]" coins={coins} />
          <HomeResourcesList tw="shrink-0" {...{ resources }} />
          {!!articles?.length && <HomeArticlesList tw="shrink-0" {...{ articles }} />}
        </div>
      </main>
    </>
  )
}
