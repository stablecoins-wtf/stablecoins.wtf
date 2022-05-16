import { gql } from '@apollo/client'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { apolloClient } from './apolloClient'
import { env } from './environment'

export const getAllCoinsAndMetadata: GetStaticProps = async () => {
  // Query GraphCMS
  const { data: graphcmsData } = await apolloClient.query({
    query: gql`
      query Coins {
        coins {
          id
          name
          symbol
          slug
          description { raw }
        }
      }
    `,
  })
  let coinsData = graphcmsData.coins

  // Query Coinmarketcap 
  // TODO Improve by using the Coinmarketcap-IDs instead
  const symbols = coinsData.map((c: any) => c.symbol).join(',')
  const params = new URLSearchParams({
    symbol: symbols,
    // skip_invalid: 'true',
  }).toString()
  const cmcBaseUrl = 'https://pro-api.coinmarketcap.com'
  const headers = { 'X-CMC_PRO_API_KEY': env.coinmarketcapApiKey }
  const { data: cmcMetadata } = await axios.get(`${cmcBaseUrl}/v2/cryptocurrency/info?${params}`, { headers })
  const { data: cmcLatestQuotes } = await axios.get(`${cmcBaseUrl}/v2/cryptocurrency/quotes/latest?${params}`, { headers })

  // Hydrate coins-data with coinmarketcap-data
  const getCmcDataForSymbol = (data: any, symbol: string) => 
    data?.data?.[symbol.toUpperCase()]?.[0] || {}
  coinsData = coinsData.map((c: any) => ({
    ...c,
    cmcMetadata: getCmcDataForSymbol(cmcMetadata, c.symbol),
    cmcLatestQuotes: getCmcDataForSymbol(cmcLatestQuotes, c.symbol),
  }))
  
  return {
    props: {
      coinsData,
    },
    revalidate: 1000,
  }
}