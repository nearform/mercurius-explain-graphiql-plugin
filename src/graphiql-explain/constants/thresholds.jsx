import { NegativeIndicator } from '../../icons/negative-indicator'
import { PositiveIndicator } from '../../icons/positive-indicator'
import { NeutralIndicator } from '../../icons/neutral-indicator'

const lightColors = {
  low: '#21835F',
  medium: '#9E5F00',
  high: '#D43408',
  default: 'inherit'
}

const darkColors = {
  low: '#00D688',
  medium: '#FFCC99',
  high: '#FF5729',
  default: 'inherit'
}

export const isLight = () =>
  !!document.querySelectorAll('.graphiql-light').length

export const colors = isLight() ? lightColors : darkColors

const thresholds = [
  {
    limit: 0.5,
    color: colors.low,
    symbol: <PositiveIndicator color={colors.low} />
  },
  {
    limit: 0.7,
    color: colors.medium,
    symbol: <NeutralIndicator color={colors.medium} />
  },
  {
    limit: 0.9,
    color: colors.high,
    symbol: <NegativeIndicator color={colors.high} />
  }
]

export const reverseThresholds = thresholds.reverse()
