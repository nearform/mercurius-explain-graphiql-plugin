import React from 'react'
import { useExplain } from './useExplain'

export function Content() {
  const { explain } = useExplain()

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
