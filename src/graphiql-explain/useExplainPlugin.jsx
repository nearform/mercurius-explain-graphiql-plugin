import { GraphiQLProvider } from 'graphiql'
import { useMemo, useRef } from 'react'
import { fetcher } from '../utils'
import { Content, Icon } from './Explain'

export function useExplainPlugin(props) {
  const propsRef = useRef(props)
  propsRef.current = props

  return useMemo(
    () => ({
      title: 'GraphiQL Explorer',
      icon: () => <Icon />,
      content: () => (
        <GraphiQLProvider fetcher={fetcher}>
          <Content {...propsRef.current} />
        </GraphiQLProvider>
      )
    }),
    []
  )
}
