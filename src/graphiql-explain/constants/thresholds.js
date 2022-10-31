export const colors = {
  low: 'rgb(219 175 53)',
  medium: '#FFA500',
  high: 'rgb(255 78 78)',
  veryHigh: '#FF0000',
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
