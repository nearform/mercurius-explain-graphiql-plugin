import React from 'react'
import { useExplain } from './useExplain'
import arrow from '../icons/arrow.svg'

export function Content() {
  const {
    explain,
    searchByPath,
    changePathOrder,
    changeTimeOrder,
    timeOrder,
    pathOrder
  } = useExplain()

  return (
    <div style={{ height: '100%' }}>
      <input type="text" onChange={searchByPath} placeholder="Search by path" />
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th
              onClick={changePathOrder}
              style={{ margin: 0, padding: 0, width: '50%' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <p>Path</p>
                {pathOrder !== 0 && (
                  <img
                    src={arrow}
                    style={{
                      height: '20px',
                      // width: '20px',
                      margin: 0,
                      rotate: pathOrder > 0 ? '0deg' : '180deg'
                    }}
                    alt={`arrow-${pathOrder > 0 ? 'up' : 'down'}`}
                  />
                )}
              </div>
            </th>
            <th
              onClick={changeTimeOrder}
              style={{ margin: 0, padding: 0, width: '50%' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <p>Time(ms)</p>
                {timeOrder !== 0 && (
                  <img
                    src={arrow}
                    style={{
                      // height: '20px',
                      width: '20px',

                      rotate: timeOrder > 0 ? '0deg' : '180deg'
                    }}
                    alt={`arrow-${timeOrder > 0 ? 'up' : 'down'}`}
                  />
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {explain && explain.length > 0 ? (
            explain.map(e => {
              return (
                <tr key={e.path}>
                  <td>{e.path}</td>
                  <td>{(e.time * 1e-6).toFixed(2)} </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td>No entry found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
export function Icon() {
  return <p>GE</p>
}
