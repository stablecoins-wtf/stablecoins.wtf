import { Article } from '@models/Article.model'
import { Coin } from '@models/Coin.model'
import { Resource } from '@models/Resource.model'
import dayjs from 'dayjs'
import { FC } from 'react'
import 'twin.macro'

export interface HomeContentHeaderProps {
  item: Article | Resource | Coin
  hideTopBar?: boolean
}
export const HomeContentHeader: FC<HomeContentHeaderProps> = ({ item, hideTopBar, ...props }) => {
  const tags = (item as Article).tags || []
  const title =
    (item as Article | Resource).title || (item instanceof Coin && `${item.name}, $${item.symbol}`)
  const subtitle =
    (item as Article | Resource).subtitle || (item instanceof Coin && 'USD-pegged Stablecoin')

  return (
    <>
      <div tw="-mx-3 divide-y divide-bbg-gray3 border-y border-bbg-gray3" {...props}>
        {/* Tags & Date */}
        {!hideTopBar && (
          <div tw="px-3 py-2 flex justify-between">
            <p tw="text-bbg-gray2 text-sm whitespace-nowrap">
              <span tw="hidden md:inline whitespace-pre">Last updated at </span>
              <time
                dateTime={dayjs(item.updatedAt).format('YYYY-MM-DD hh:mm')}
                itemProp="dateModified"
              >
                {dayjs(item.updatedAt).format('YYYY/MM/DD hh:mm')}
              </time>
            </p>
            {!!tags.length && (
              <div tw="flex flex-wrap -mx-1 -my-0.5 ml-2 justify-end" itemProp="keywords">
                {tags.map((tag) => (
                  <div key={tag} tw="mx-1 my-0.5 text-bbg-gray1 text-sm tracking-wide lowercase">
                    #{tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Title & Subtitle */}
        <div tw="px-3 pt-4 pb-4">
          <div tw="flex flex-col text-center">
            <h1 tw="text-2xl tracking-tight font-bold" itemProp="headline">
              {title}
            </h1>
            {subtitle && (
              <p tw="text-bbg-gray2 mt-0.5" itemProp="description">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
