import React, { useCallback } from 'react'
import { useExplain } from './useExplain'
import arrow from '../icons/arrow.svg'

const thStyle = {
  margin: '0 5px 0 0',
  padding: 0,
  width: '33%'
}

const getThContentWrapperStyle = (alignLeft = true) => ({
  display: 'flex',
  justifyContent: alignLeft ? 'flex-start' : 'flex-end'
})

const getArrowStyleRotation = shouldRotate => ({
  height: '20px',
  margin: 0,
  rotate: shouldRotate ? '180deg' : '0deg'
})

const tdStyles = {
  textAlign: 'right'
}

const overThresholdStyle = {
  color: 'red'
}

export function Content() {
  const {
    explain,
    searchByPath,
    changePathOrder,
    changeTimeOrder,
    changeTotalOrder,
    timeOrder,
    pathOrder,
    totalOrder,
    timeThresholdMs,
    totalThresholdMs
  } = useExplain()

  const getOverThresholdStyles = useCallback(
    (value, threshold) => (value > threshold ? overThresholdStyle : null),
    []
  )

  const tableHeaders = React.useMemo(() => {
    return [
      {
        label: 'Path',
        order: pathOrder,
        onClick: changePathOrder,
        alignmentLeft: true
      },
      {
        label: 'Time(ms)',
        order: timeOrder,
        onClick: changeTimeOrder,
        alignmentLeft: false
      },
      {
        label: 'Total(ms)',
        order: totalOrder,
        onClick: changeTotalOrder,
        alignmentLeft: false
      }
    ]
  }, [
    pathOrder,
    changePathOrder,
    timeOrder,
    changeTimeOrder,
    totalOrder,
    changeTotalOrder
  ])

  return (
    <div style={{ height: '100%' }}>
      <input type="text" onChange={searchByPath} placeholder="Search by path" />
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {tableHeaders.map(({ onClick, order, label, alignmentLeft }) => (
              <th key={label} onClick={onClick} style={thStyle}>
                <div style={getThContentWrapperStyle(alignmentLeft)}>
                  <p>{label}</p>
                  {order !== 0 && (
                    <img
                      src={arrow}
                      style={getArrowStyleRotation(order > 0)}
                      alt={`arrow-${order > 0 ? 'up' : 'down'}`}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {explain && explain.length > 0 ? (
            explain.map(({ path, time, totalTime }) => {
              const timeMs = time * 1e-6
              const totalTimeMs = totalTime * 1e-6
              return (
                <tr key={path}>
                  <td>{path}</td>
                  <td
                    style={{
                      ...getOverThresholdStyles(timeMs, timeThresholdMs),
                      ...tdStyles
                    }}
                  >
                    {timeMs.toFixed(2)}
                  </td>
                  <td
                    style={{
                      ...getOverThresholdStyles(totalTimeMs, totalThresholdMs),
                      ...tdStyles
                    }}
                  >
                    {totalTimeMs.toFixed(2)}
                  </td>
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
