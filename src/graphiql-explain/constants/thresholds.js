export const thresholds = [
  {
    limit: 0.5,
    color: '#ece75f'
  },
  {
    limit: 0.7,
    color: '#FFFF00'
  },
  {
    limit: 0.9,
    color: '#FFA500'
  },
  {
    limit: 0.99,
    color: '#FF0000'
  }
]

const reverseThresholds = thresholds.slice().reverse()

export function getColorByLimit(maxLimit) {
  const currentThreshold = reverseThresholds.find(
    ({ limit }) => maxLimit >= limit
  )
  if (currentThreshold) {
    return currentThreshold.color
  }
  return '#FFF'
}
