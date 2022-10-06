import { useMemo, useRef } from 'react'
import { Content, Icon } from './Explain'

export function useExplainPlugin(props) {
  const propsRef = useRef(props)
  propsRef.current = props
  return useMemo(
    () => ({
      title: 'GraphiQL Explorer',
      icon: () => <Icon />,
      content: () => <Content {...propsRef.current} />
    }),
    []
  )
}
