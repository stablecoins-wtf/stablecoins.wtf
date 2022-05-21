import { gql } from 'graphql-request'
import { cache } from './buildCache'
import { graphCmsClient } from './graphCmsClient'

/**
 * Query resources/articles from GraphCMS
 */
export interface ResourcesDataProps {
  resourcesData: any[];
}
export const getAllResources = async (): Promise<ResourcesDataProps> => {
  const resourcesData = await fetchOrGetResources()
  return { resourcesData }
}

/**
 * Ether fetches resourcesData or returns it from the local-file `.cache`
 */
export const fetchOrGetResources = async (forceFetch?: boolean) => {
  let resourcesData = await cache.get('resources')
  if (resourcesData && !forceFetch) return resourcesData

  resourcesData = await queryGraphCms()

  await cache.set('resources', resourcesData)

  return resourcesData
}

/**
 * Fetches all resources-articles from the GraphCMS database.
 */
const queryGraphCms = async () => {
  const query = gql`
    query Coins {
      resources {
        id
        title
        slug
        content {
          raw
        }
      }
    }
  `
  const data = await graphCmsClient.request(query)
  return data.resources
}
