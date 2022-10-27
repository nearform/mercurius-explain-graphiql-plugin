export const colors = {
  yellowLight: '#ECE75F',
  yellow: '#FFFF00',
  orange: '#FFA500',
  red: '#FF0000',
  white: '#FFFFFF'
}

const thresholds = [
  {
    limit: 0.5,
    color: colors.yellowLight
  },
  {
    limit: 0.7,
    color: colors.yellow
  },
  {
    limit: 0.9,
    color: colors.orange
  },
  {
    limit: 0.99,
    color: colors.red
  }
]

export const reverseThresholds = thresholds.reverse()
