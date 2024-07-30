import { gql } from '@apollo/client'
import axios from 'axios'
import dayjs from 'dayjs'
import { cache } from './buildCache'
import { env } from './environment'
import { graphCmsClient } from './graphCmsClient'

/**
 * Query, merge, and cache data from the following sources:
 * – GraphCMS (static data from headless cms)
 * – Coinmarketcap (meta-data for coins)
 */
export interface CoinsDataProps {
  coinsData: any[]
}
export const getAllCoinsAndMetadata = async (): Promise<CoinsDataProps> => {
  const coinsData = await fetchOrGetCoinsData()
  return { coinsData }
}

/**
 * Ether fetches `coinsData` or returns it from the local-file `.cache`
 */
export const fetchOrGetCoinsData = async (forceFetch?: boolean) => {
  let coinsData = await cache.get('coins')
  if (coinsData && !forceFetch) return coinsData

  coinsData = await queryGraphCms()
  coinsData = await updateCoinmarketcapMetadata(coinsData)

  await cache.set('coins', coinsData)
  return coinsData
}

/**
 * Fetches all static and cached coin-data from the GraphCMS database.
 */
const queryGraphCms = async () => {
  const query = gql`
    query Coins {
      coins {
        id
        documentInStages(stages: PUBLISHED) {
          id
        }
        createdAt
        updatedAt
        name
        symbol
        slug
        coingeckoId
        description {
          raw
        }
        mechanism
        jurisdiction
        issuer
        governance
        color {
          hex
        }

        unavailableOnCMC
        cmcMetadata

        cgTradingData
      }
    }
  `
  const data = (await graphCmsClient.request(query)) as any
  return data.coins
}

/**
 * Checks whether the cached metadata is outdated (older than CMC_METADATA_MAX_AGE_MINUTES).
 * If yes, it's re-fetched, merged into the coinsData, and updated in the GraphCMS database.
 */
const CMC_METADATA_MAX_AGE_MINUTES = 60 * 24
const updateCoinmarketcapMetadata = async (coinsData: any[]) => {
  // Determin symbols to fetch for (because attribute does not yet exist or is outdated)
  const coinsToUpdate = coinsData.filter((c: any) => {
    const isUnavailable = !!c?.unavailableOnCMC
    if (isUnavailable) return false
    const updatedAt = c?.cmcMetadata?.updatedAt
    const isOutdated = dayjs().diff(updatedAt, 'minute', true) > CMC_METADATA_MAX_AGE_MINUTES
    return !updatedAt || isOutdated
  })
  if (!coinsToUpdate?.length) return coinsData

  // Fetch new data
  const symbols = coinsToUpdate.map((c: any) => c.symbol).join(',')
  // console.log('Updating cmcMetadata for symbols: ', symbols)
  const params = new URLSearchParams({ symbol: symbols }).toString()
  const headers = { 'X-CMC_PRO_API_KEY': env.coinmarketcapApiKey }
  const { data } = await axios.get(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?${params}`,
    { headers },
  )

  const updatedAt = dayjs().toISOString()
  for (const [symbol, cmcMetadataData] of Object.entries(data?.data || {})) {
    // console.log('Updating cached cmcMetadata for symbol: ', symbol)
    // Merge into coinsData
    const cmcMetadata = {
      ...((cmcMetadataData as any)?.[0] || {}),
      updatedAt,
    }
    const coinData = coinsData.find((c: any) => c.symbol === symbol)
    coinData['cmcMetadata'] = cmcMetadata

    // Asynchronously mutate and re-publish in GraphCMS
    const isDraft = !coinData?.documentInStages?.length && !env.isProduction
    const publishMutation = `
      publishCoin(where: { symbol: $symbol }, to: PUBLISHED) {
        id
      }
    `
    const mutation = gql`
      mutation UpdateAndPublishCoin($symbol: String!, $cmcMetadata: Json!) {
        updateCoin(where: { symbol: $symbol }, data: { cmcMetadata: $cmcMetadata }) {
          id
        }
        ${isDraft ? '' : publishMutation}
      }
    `
    graphCmsClient.request(mutation, { symbol, cmcMetadata })
  }

  return coinsData
}
