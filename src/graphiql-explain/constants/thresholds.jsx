import { ReactComponent as NegativeIndicator } from '../../icons/negative-indicator.svg'
import { ReactComponent as PositiveIndicator } from '../../icons/positive-indicator.svg'
import { ReactComponent as NeutralIndicator } from '../../icons/neutral-indicator.svg'

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
    color: colors.low,
    symbol: <PositiveIndicator />
  },
  {
    limit: 0.7,
    color: colors.medium,
    symbol: <NeutralIndicator />
  },
  {
    limit: 0.9,
    color: colors.high,
    symbol: <NegativeIndicator />
  },
  {
    limit: 0.99,
    color: colors.veryHigh,
    symbol: <NegativeIndicator />
  }
]

export const reverseThresholds = thresholds.reverse()
