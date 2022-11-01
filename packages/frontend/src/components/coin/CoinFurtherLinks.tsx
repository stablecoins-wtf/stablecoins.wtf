import { ProseWrapper } from '@components/shared/ProseWrapper'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { CoinDetailsProps } from './CoinDetails'

export const CoinFurtherLinks: FC<CoinDetailsProps> = ({ coin }) => {
  const metaUrls = coin?.cmcMetadata?.urls || {}
  const links = {
    Website: metaUrls.website?.[0],
    Twitter: metaUrls.twitter?.[0],
    Reddit: metaUrls.reddit?.[0],
    Documentation: metaUrls.technical_doc?.[0],
    'Source Code': metaUrls.source_code?.[0],
  }
  const hasAnyLink = !!Object.values(links).filter(Boolean).length
  if (!hasAnyLink) return null

  return (
    <>
      <ProseWrapper tw="max-w-full">
        <h2>Further Links</h2>
        <ul>
          {Object.entries(links).map(([title, url]) =>
            url ? (
              <li key={url}>
                {title}:{' '}
                <Link href={url} tw="break-words" target="_blank">
                  {url}
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </ProseWrapper>
    </>
  )
}
