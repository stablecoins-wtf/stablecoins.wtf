import dayjs from 'dayjs'
import fse from 'fs-extra'
import path from 'path'


const getCachePath = (id: string) => {
  return path.join(process.cwd(), `.cache/${id}.json`)
}

/**
 * Cache to speed up build-process by minimizing repetetive, server-side fetching calls 
 * See: https://github.com/vercel/examples/tree/main/solutions/reuse-responses
 */
export const cache = {
  get: async (id: string) => {
    try {
      const buffer = await fse.readFile(getCachePath(id))
      const {data, date} = JSON.parse(buffer as unknown as string)
      if (!data || !date) throw new Error('No valid data found')
      const isOutdated = dayjs().diff(date, 'second') > 60
      if (isOutdated) throw new Error('Data outdated')
      return data

    } catch (e) {
      return null
    }
  },
  set: async (id: string, data: any) => {
    return await fse.outputFile(
      path.join(getCachePath(id)),
      JSON.stringify({
        date: dayjs().toISOString(),
        data,
      })
    )
  },
}
