import { CoingeckoTradingDataPoint } from '@models/Coin.model'
import dayjs, { ManipulateType } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

/**
 * Takes a sorted array of CoinGecko data points and returns
 * the latest (most recent) which should be the last item in the array.
 */
export const getLatestCgDataPoint = (
  sortedDataPoints: CoingeckoTradingDataPoint[] | undefined,
): CoingeckoTradingDataPoint | undefined => {
  if (!sortedDataPoints?.length) return undefined
  const dataPoint = sortedDataPoints[sortedDataPoints.length - 1] || []
  if (dataPoint?.[0] === undefined || dataPoint?.[1] === undefined) return undefined
  return dataPoint
}

/**
 * Takes a sorted array of CoinGecko data points and returns
 * the one that is within the range of the given date distance
 * (value & unit) +/- the given precision.
 */
export const getCgDataPointFromTimeAgo = (
  sortedDataPoints: CoingeckoTradingDataPoint[] | undefined,
  value: number,
  unit: ManipulateType,
  precision = 0.5,
): CoingeckoTradingDataPoint | undefined => {
  if (!sortedDataPoints?.length) return undefined
  const now = dayjs()
  const timeAgoUpperBound = now.subtract(value - precision, unit)
  const timeAgoLowerBound = now.subtract(value + precision, unit)
  for (let i = sortedDataPoints.length - 1; i >= 0; i--) {
    const date = dayjs(sortedDataPoints[i]?.[0])
    const isWithinUpperBound = date.isBefore(timeAgoUpperBound)
    const isWithinLowerBound = date.isAfter(timeAgoLowerBound)
    if (isWithinUpperBound && isWithinLowerBound) return sortedDataPoints[i]
    if (!isWithinLowerBound) break // Can be assumed as the array is sorted
  }
  return undefined
}

/**
 * Takes a sorted array of CoinGecko data points and returns
 * the accumulated value until the given date distance (value & unit)
 */
export const getAccumulatedValueUntilTimeAgo = (
  sortedDataPoints: CoingeckoTradingDataPoint[] | undefined,
  value: number,
  unit: ManipulateType,
): CoingeckoTradingDataPoint | undefined => {
  if (!sortedDataPoints?.length) return undefined
  const now = dayjs()
  const timeAgoLowerBound = now.subtract(value, unit)
  let accumulatedDataPoint: CoingeckoTradingDataPoint | undefined
  for (let i = sortedDataPoints.length - 1; i >= 0; i--) {
    const date = dayjs(sortedDataPoints[i]?.[0])
    const isWithinLowerBound = date.isSameOrAfter(timeAgoLowerBound)
    if (!isWithinLowerBound) break // Can be assumed as the array is sorted
    if (!accumulatedDataPoint) accumulatedDataPoint = [...sortedDataPoints[i]]
    else
      accumulatedDataPoint = [
        sortedDataPoints[i]?.[0],
        accumulatedDataPoint[1] + sortedDataPoints[i]?.[1],
      ]
  }
  return accumulatedDataPoint
}
