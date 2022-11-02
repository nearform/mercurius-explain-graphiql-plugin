import React, { useState } from 'react'
import { getColorByLimit } from '../utils'
import { ReactComponent as ArrowIcon } from '../../icons/arrow.svg'
import { ReactComponent as ChartIcon } from '../../icons/chart.svg'
import { useProfiler } from '../hooks/useProfiler'
import styles from './Profiler.module.css'
import { Modal } from './Modal'
import { WaterfallChart } from './WaterfallChart'

export const Profiler = () => {
  const {
    profiler,
    searchByPath,
    changePathOrder,
    changeTimeOrder,
    changeTotalOrder,
    timeOrder,
    pathOrder,
    totalOrder,
    limits
  } = useProfiler()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tableHeaders = React.useMemo(() => {
    return [
      {
        label: 'Path',
        order: pathOrder,
        onClick: changePathOrder,
        alignmentLeft: true
      },
      {
        label: 'Time (ms)',
        order: timeOrder,
        onClick: changeTimeOrder,
        alignmentLeft: false
      },
      {
        label: 'Total (ms)',
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
    <>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
          <WaterfallChart
            data={profiler}
            filters={tableHeaders}
            limits={limits}
          />
        </Modal>
      )}
      <div className={styles.headerContainer}>
        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            onChange={searchByPath}
            name="searchPath"
            required
          />
          <label htmlFor="searchPath" className={styles.searchLabel}>
            Search by path
          </label>
        </div>
        {profiler && profiler.length > 0 ? (
          <div
            className={styles.chartIconContainer}
            onClick={() => setIsModalOpen(true)}
            data-testid="open-profiler-waterfall-chart"
          >
            <ChartIcon fill="currentColor" className={styles.chartIcon} />
          </div>
        ) : null}
      </div>
      <table className={styles.explainData}>
        <thead>
          <tr>
            {tableHeaders.map(({ onClick, order, label, alignmentLeft }) => (
              <th
                key={label}
                onClick={onClick}
                className={`${styles.th} ${
                  alignmentLeft
                    ? styles.tableCellAlignLeft
                    : styles.tableCellAlignRight
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
                  {order !== 0 && (
                    <ArrowIcon
                      fill="currentColor"
                      className={`${styles.arrow} ${
                        order > 0 ? styles.rotate180 : ''
                      }`}
                      alt={`arrow-${order > 0 ? 'up' : 'down'}`}
                    />
                  )}
                  <p>{label}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {profiler && profiler.length > 0 ? (
            profiler.map(({ path, time, totalTime }) => {
              const timeMs = time * 1e-6
              const totalTimeMs = totalTime * 1e-6
              return (
                <tr key={path}>
                  <td>{path}</td>
                  <td
                    style={{
                      color: getColorByLimit(time / limits.time)
                    }}
                    className={styles.tableCellAlignRight}
                  >
                    {timeMs.toFixed(2)}
                  </td>
                  <td
                    style={{
                      color: getColorByLimit(totalTime / limits.totalTime)
                    }}
                    className={styles.tableCellAlignRight}
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
    </>
  )
}
