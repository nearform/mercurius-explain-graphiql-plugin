import React, { useMemo } from 'react'
import { ReactComponent as ArrowIcon } from '../../icons/arrow.svg'
import { useResolverCalls } from '../hooks/useResolverCalls'
import styles from './ResolverCalls.module.css'
import { SearchInput } from './SearchInput'

export const ResolverCalls = () => {
  const {
    resolverCalls,
    countOrder,
    changeCountOrder,
    keyOrder,
    changeKeyOrder,
    searchByKey
  } = useResolverCalls()

  const tableHeaders = useMemo(() => {
    return [
      {
        label: 'Key',
        order: keyOrder,
        onClick: changeKeyOrder,
        alignmentLeft: true
      },
      {
        label: 'Count',
        order: countOrder,
        onClick: changeCountOrder,
        alignmentLeft: false
      }
    ]
  }, [keyOrder, changeKeyOrder, countOrder, changeCountOrder])

  return (
    <>
      <div className={styles.searchContainer}>
        <SearchInput
          onChange={searchByKey}
          name="searchKey"
          placeholder="Search by key"
        />
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
            ${alignmentLeft ? styles.justifyFlexStart : styles.justifyFlexEnd}`}
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
          {resolverCalls && resolverCalls.length > 0 ? (
            resolverCalls.map(({ key, count }) => {
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td className={styles.tableCellAlignRight}>{count}</td>
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
