import dayjs from 'dayjs'
import { FC } from 'react'
import 'twin.macro'

export interface HomeContentHeaderProps {
  title: string
  subtitle?: string
  updatedAt?: Date
  tags?: string[]
  hideTopBar?: boolean
}
export const HomeContentHeader: FC<HomeContentHeaderProps> = ({
  title,
  subtitle,
  updatedAt,
  tags,
  hideTopBar,
  ...props
}) => {
  return (
    <>
      <div tw="-mx-3 divide-y divide-bbg-gray3 border-y border-bbg-gray3" {...props}>
        {/* Tags & Date */}
        {!hideTopBar && (
          <div tw="px-3 py-2 flex justify-between">
            <p tw="text-bbg-gray2 text-sm whitespace-nowrap">
              <span tw="hidden md:inline whitespace-pre">Last updated at </span>
              <time dateTime={dayjs(updatedAt).format('YYYY-MM-DD hh:mm')} itemProp="dateModified">
                {dayjs(updatedAt).format('YYYY/MM/DD hh:mm')}
              </time>
            </p>
            {!!(tags || []).length && (
              <div tw="flex flex-wrap -mx-1 -my-0.5 ml-2 justify-end" itemProp="keywords">
                {(tags || []).map((tag) => (
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
