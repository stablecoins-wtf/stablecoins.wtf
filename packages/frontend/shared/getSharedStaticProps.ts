import { Coin } from '@models/Coin.model'
import { Resource } from '@models/Resource.model'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import {
  CoinsDataProps,
  getAllCoinsAndMetadata
} from './getAllCoinsAndMetadata'
import { getAllResources, ResourcesDataProps } from './getAllResources'


/**
 * Merges the following into globally shared static props:
 * - `getAllCoinsAndMetadata`
 * - `getAllResources`
 */
export type SharedStaticProps = CoinsDataProps & ResourcesDataProps;
export const getSharedStaticProps: GetStaticProps = async () => {
  const coinsData = await getAllCoinsAndMetadata()
  const resourcesData = await getAllResources()

  return {
    props: {
      ...coinsData,
      ...resourcesData,
    } as SharedStaticProps,
    revalidate: 60 * 10, // 10 minutes
  }
}


/**
 * Helper hook to extract and parse fetched data into respective models
 */
export interface ParsedSharedStaticProps {
  coins: Coin[]
  resources: Resource[]
}
export const useSharedStaticProps = ({coinsData, resourcesData}: SharedStaticProps): ParsedSharedStaticProps => {
  const [coins, setCoins] = useState<Coin[]>([])
  const [resources, setResources] = useState<Resource[]>([])

  // Initialize Coins
  useEffect(() => {
    setCoins((coinsData || [])
      .map(Coin.fromObject)
      .filter(Boolean) as Coin[])
  }, [coinsData])

  // Initialize Resources
  useEffect(() => {
    setResources((resourcesData || [])
      .map(Resource.fromObject)
      .filter(Boolean) as Resource[])
  }, [coinsData])

  return { coins, resources }
}