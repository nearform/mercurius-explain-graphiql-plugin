import React, { useMemo, useRef } from 'react'

function Content() {
  return <div>This is the content </div>
}
function Icon() {
  return <p>GE</p>
}
export function useExplorerPlugin(props) {
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
