import dayjs from 'dayjs'

export const datesAreSameDay = (d1: any, d2: any): boolean => {
  return dayjs(d1).format('YYYY-MM-DD') === dayjs(d2).format('YYYY-MM-DD')
}
