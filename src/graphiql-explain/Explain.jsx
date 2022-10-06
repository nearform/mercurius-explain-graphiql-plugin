import React, { useEffect, useState } from 'react'
import { useEditorContext, useResponseEditor } from '@graphiql/react'
export function Content(props) {
  const [__explain, setExplain] = useState()

  const editorContext = useEditorContext({
    nonNull: true,
    caller: useResponseEditor()
  })
  useEffect(() => {
    if (editorContext.tabs[editorContext.activeTabIndex].response) {
      const response = JSON.parse(
        editorContext.tabs[editorContext.activeTabIndex].response
      )
      if (response?.data?.__explain) {
        setExplain([...response.data.__explain])
        delete response.data.__explain
        editorContext.tabs[editorContext.activeTabIndex].response =
          JSON.stringify(response)
      }
    }
  }, [editorContext])
  return (
    <div style={{ height: '100%' }}>
      {__explain &&
        __explain.length > 0 &&
        __explain.map(e => {
          return (
            <div key={e.path} style={{ display: 'flex' }}>
              <p style={{ margin: '5px 10px' }}>{e.path}</p>
              <p style={{ margin: '5px 10px' }}>{e.start}</p>
              <p style={{ margin: '5px 10px' }}>{e.stop}</p>
              <p style={{ margin: '5px 10px' }}>{e.time}</p>
            </div>
          )
        })}
    </div>
  )
}
export function Icon() {
  return <p>GE</p>
}
