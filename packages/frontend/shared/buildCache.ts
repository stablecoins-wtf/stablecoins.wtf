import dayjs from 'dayjs'
import fse from 'fs-extra'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import path from 'path'
import { env } from './environment'

const getCachePath = (id: string) => {
  return path.join(process.cwd(), `.cache/${id}.json`)
}

const cacheIsEnabled = env.buildCacheMaxAge > 0
  && !(env.isProduction && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD)

/**
 * Cache to speed up build-process by minimizing repetetive, server-side fetching calls
 * See: https://github.com/vercel/examples/tree/main/solutions/reuse-responses
 */
export const cache = {
  get: async (id: string) => {
    if (!cacheIsEnabled) return null
    try {
      const buffer = await fse.readFile(getCachePath(id))
      const { data, date } = JSON.parse(buffer as unknown as string)
      if (!data || !date) throw new Error('No valid data found')
      const isOutdated = dayjs().diff(date, 'second') > env.buildCacheMaxAge
      if (isOutdated) throw new Error('Data outdated')
      console.log('CACHE HIT')
      return data
    } catch (e) {
      console.log('CACHE MISS')
      return null
    }
  },
  set: async (id: string, data: any) => {
    if (!cacheIsEnabled) return null
    console.log('CACHE WRITE')

    return await fse.outputFile(
      path.join(getCachePath(id)),
      JSON.stringify({
        date: dayjs().toISOString(),
        data,
      })
    )
  },
}
