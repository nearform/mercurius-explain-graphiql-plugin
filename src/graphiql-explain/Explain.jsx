import React from 'react'
import { useExplain } from './useExplain'
import arrow from '../icons/arrow.svg'
import styles from './Explain.module.css'

const getOverThresholdStyles = (value, threshold) =>
  value > threshold ? styles.overThreshold : ''

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
    <div className={styles.height100}>
      <input type="text" onChange={searchByPath} placeholder="Search by path" />
      <table className={styles.width100}>
        <thead>
          <tr>
            {tableHeaders.map(({ onClick, order, label, alignmentLeft }) => (
              <th
                key={label}
                onClick={onClick}
                className={`${styles.th} ${
                  alignmentLeft ? styles.textAlignLeft : styles.textAlignRight
                }`}
              >
                <div
                  className={`${styles.thContent}
                    ${
                      alignmentLeft
                        ? styles.justifyFlexStart
                        : styles.justifyFlexEnd
                    }`}
                >
                  <p>{label}</p>
                  {order !== 0 && (
                    <img
                      src={arrow}
                      className={`${styles.arrow} ${
                        order > 0 ? styles.rotate180 : ''
                      }`}
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
                    className={`${
                      styles.textAlignRight
                    } ${getOverThresholdStyles(timeMs, timeThresholdMs)}`}
                  >
                    {timeMs.toFixed(2)}
                  </td>
                  <td
                    className={`${
                      styles.textAlignRight
                    } ${getOverThresholdStyles(totalTimeMs, totalThresholdMs)}`}
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
