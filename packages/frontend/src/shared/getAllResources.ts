import { gql } from 'graphql-request'
import { cache } from './buildCache'
import { graphCmsClient } from './graphCmsClient'

/**
 * Query resources from GraphCMS
 */
export interface ResourcesDataProps {
  resourcesData: any[]
}
export const getAllResources = async (): Promise<ResourcesDataProps> => {
  const resourcesData = await fetchOrGetResources()
  return { resourcesData }
}

/**
 * Ether fetches `resourcesData` or returns it from the local-file `.cache`
 */
export const fetchOrGetResources = async (forceFetch?: boolean) => {
  let resourcesData = await cache.get('resources')
  if (resourcesData && !forceFetch) return resourcesData

  resourcesData = await queryGraphCms()

  await cache.set('resources', resourcesData)

  return resourcesData
}

/**
 * Fetches all resources from the GraphCMS database.
 */
const queryGraphCms = async () => {
  const query = gql`
    query Resources {
      resources {
        id
        createdAt
        updatedAt
        title
        subtitle
        slug
        content {
          raw
        }
        tags
      }
    }
  `
  const { resources } = await graphCmsClient.request(query)
  return resources
}
