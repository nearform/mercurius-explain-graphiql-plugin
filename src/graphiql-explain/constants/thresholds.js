export const colors = {
  low: 'rgb(219 175 53)',
  medium: 'rgb(255 165 0)',
  high: 'rgb(255 78 78)',
  veryHigh: 'rgb(255 0 0)',
  default: 'inherit'
}

const thresholds = [
  {
    limit: 0.5,
    color: colors.low
  },
  {
    limit: 0.7,
    color: colors.medium
  },
  {
    limit: 0.9,
    color: colors.high
  },
  {
    limit: 0.99,
    color: colors.veryHigh
  }
]

export const reverseThresholds = thresholds.reverse()
