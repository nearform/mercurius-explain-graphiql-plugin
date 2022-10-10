import React, { useEffect, useState } from 'react'
import { explainDataManager } from './ExplainDataManager'

export function Content() {
  const [explain, setExplain] = useState(explainDataManager.getExplainData())
  console.log(explain)
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
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Path</th>
            <th style={{ textAlign: 'left' }}>Time (ms) </th>
          </tr>
        </thead>
        <tbody>
          {explain &&
            explain.length > 0 &&
            explain.map(e => {
              return (
                <tr key={e.path}>
                  <td>{e.path}</td>
                  <td>{(e.time * 1e-6).toFixed(2)} </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
export function Icon() {
  return <p>GE</p>
}
