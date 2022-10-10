import React, { useEffect, useState } from 'react'
import { explainDataManager } from './ExplainDataManager'

export function Content() {
  const [explain, setExplain] = useState(explainDataManager.getExplainData())

  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        setExplain(_ => e.target?.explainData)
      }
    )
    return () => {
      explainDataManager.removeEventListener('updateExplainData', eventListener)
    }
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex' }}>
        <p style={{ margin: '5px 10px' }}>Path</p>
        <p style={{ margin: '5px 10px' }}>Time</p>
      </div>

      {explain &&
        explain.length > 0 &&
        explain.map(e => {
          return (
            <div key={e.path} style={{ display: 'flex' }}>
              <p style={{ margin: '5px 10px' }}>{e.path}</p>
              <p style={{ margin: '5px 10px' }}>
                {e.time.toFixed(2)} nanoseconds
              </p>
            </div>
          )
        })}
    </div>
  )
}
export function Icon() {
  return <p>GE</p>
}
