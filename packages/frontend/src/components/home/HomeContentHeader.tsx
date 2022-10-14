import { env } from '@shared/environment'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { FC } from 'react'
import toast from 'react-hot-toast'
import { FaLink, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const ShareButton = styled.button(() => [
  tw`flex items-center space-x-2.5 py-2 px-4 text-sm tracking-wide whitespace-nowrap select-none outline-none cursor-pointer text-bbg-gray1 hocus:(bg-bbg-gray3 text-white)`,
])
const ShareButtonAnchor = ShareButton.withComponent('a')

export interface HomeContentHeaderProps {
  title: string
  subtitle?: string
  updatedAt?: Date
  tags?: string[]
  hideTopBar?: boolean
  hideShareBar?: boolean
}
export const HomeContentHeader: FC<HomeContentHeaderProps> = ({
  title,
  subtitle,
  updatedAt,
  tags,
  hideTopBar,
  hideShareBar,
  ...props
}) => {
  const { asPath } = useRouter()
  const url = `${env.url}${asPath.split('#')[0].split('?')[0]}`
  const baseShareParams = {
    url,
    text: title,
  }
  const twitterShareUrlParams = new URLSearchParams({
    ...baseShareParams,
    via: 'stablecoinswtf',
  }).toString()
  const twitterShareUrl = `https://twitter.com/intent/tweet?${twitterShareUrlParams}`
  const telegramShareUrlParams = new URLSearchParams(baseShareParams).toString()
  const telegramShareUrl = `https://t.me/share/url?${telegramShareUrlParams}`
  const onCopyLink = () => {
    navigator?.clipboard?.writeText(url)
    toast.dismiss()
    toast.success('Copied Link')
  }

  return (
    <>
      <div
        tw="-mx-3 mb-8 lg:mb-6 xl:mb-8 divide-y divide-bbg-gray3 border-y border-bbg-gray3"
        {...props}
      >
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
                  <div key={tag} tw="mx-1 my-0.5 text-bbg-gray2 text-sm tracking-wide lowercase">
                    #{tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Title & Subtitle */}
        <div tw="px-3 py-5">
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

        {/* Share Links */}
        {!hideShareBar && (
          <div tw="px-3 flex justify-center">
            <div tw="flex overflow-scroll divide-x divide-bbg-gray3 border-x border-bbg-gray3">
              <ShareButtonAnchor href={twitterShareUrl} target="_blank" className="group">
                <div>Share on Twitter</div>
                <FaTwitter tw="h-3.5 w-3.5 group-hover:(text-social-twitter)" />
              </ShareButtonAnchor>
              <ShareButtonAnchor href={telegramShareUrl} target="_blank" className="group">
                <div>Share on Telegram</div>
                <FaTelegramPlane tw="h-4 w-4 group-hover:(text-social-telegram)" />
              </ShareButtonAnchor>
              <ShareButtonAnchor onClick={onCopyLink} tabIndex={0}>
                <div>Copy Link</div>
                <FaLink tw="h-3.5 w-3.5" />
              </ShareButtonAnchor>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
