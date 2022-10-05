import dayjs from 'dayjs'
import { promises as fs } from 'fs'
import path from 'path'
import { env } from './environment'

const cacheDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), `.cache`)

const getCachePath = (id: string) => {
  return path.join(cacheDir, `${id}.json`)
}

const cacheIsEnabled = env.buildCacheMaxAge > 0

/**
 * Cache to speed up build-process by minimizing repetetive, server-side fetching calls
 * See: https://github.com/vercel/examples/tree/main/solutions/reuse-responses
 */
export const cache = {
  get: async (id: string) => {
    if (!cacheIsEnabled) return null
    try {
      const buffer = await fs.readFile(getCachePath(id))
      const { data, date } = JSON.parse(buffer as unknown as string)
      if (!data || !date) throw new Error('No valid data found')
      const isOutdated = dayjs().diff(date, 'second') > env.buildCacheMaxAge
      if (isOutdated) throw new Error('Data outdated')
      return data
    } catch (e) {
      return null
    }
  },
  set: async (id: string, data: any) => {
    if (!cacheIsEnabled) return null
    await fs.mkdir(cacheDir, { recursive: true })
    return await fs.writeFile(
      path.join(getCachePath(id)),
      JSON.stringify({
        date: dayjs().toISOString(),
        data,
      }),
    )
  },
}
