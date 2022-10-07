import React, { useEffect, useState } from 'react'

export function Content() {
  const [__explain, setExplain] = useState()

  const storageExplain = JSON.parse(localStorage.getItem('__explain')) || []
  useEffect(() => {
    console.log('explain', __explain)
    setExplain(_ => __explain)
  }, [storageExplain, __explain])

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex' }}>
        <p style={{ margin: '5px 10px' }}>Path</p>
        <p style={{ margin: '5px 10px' }}>Time</p>
      </div>

      {__explain &&
        __explain.length > 0 &&
        __explain.map(e => {
          return (
            <div key={e.path} style={{ display: 'flex' }}>
              <p style={{ margin: '5px 10px' }}>{e.path}</p>
              <p style={{ margin: '5px 10px' }}>{e.time.toFixed(2)} ms</p>
            </div>
          )
        })}
    </div>
  )
}
export function Icon() {
  return <p>GE</p>
}
