export const largeNumberFormatter = (x: number) => {
  if (x >= 999 && x < 1000000) {
    return (x/1000).toFixed(1) + 'K'
  } else if (x >= 1000000 && x < 999999999) {
    return (x/1000000).toFixed(1) + 'M'
  } else if (x >= 1000000000 && x < 9999999999) {
    return (x / 1000000000).toFixed(1) + 'B'
  } else if (x >= 10000000000) {
    return (x / 1000000000).toFixed(0) + 'B'
  } else {
    return x.toFixed(0)
  }
}
