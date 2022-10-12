import dayjs from 'dayjs'

/**
 * Returns true whether the days of both given dates are equal.
 * TODO Improve or refactor out (see `coingeckoHelpers.ts`)
 */
export const datesAreSameDay = (d1: any, d2: any): boolean => {
  return dayjs(d1).format('YYYY-MM-DD') === dayjs(d2).format('YYYY-MM-DD')
}
