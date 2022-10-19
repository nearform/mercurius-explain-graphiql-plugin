import { useCallback, useEffect, useState, useMemo } from 'react'
import { explainDataManager } from './ExplainDataManager'
import { appendTotalsToExplainResponse } from './utils'

export const useExplain = () => {
  const initialExplainData = useMemo(
    () => appendTotalsToExplainResponse(explainDataManager.getExplainData()),
    []
  )
  const [explain, setExplain] = useState(initialExplainData)
  const [defaultExplain, setDefaultExplain] = useState(initialExplainData)
  const [pathOrder, setPathOrder] = useState(0)
  const [timeOrder, setTimeOrder] = useState(0)
  const [totalOrder, setTotalOrder] = useState(0)

  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        const explainDataWithTotal = appendTotalsToExplainResponse(
          e.target.explainData
        )
        setDefaultExplain(() => explainDataWithTotal || [])
        setExplain(_ => explainDataWithTotal || [])
      }
    )
    return () => {
      explainDataManager.removeEventListener('updateExplainData', eventListener)
    }
  }, [])

  const searchByField = useCallback(
    fieldName => {
      return event => {
        setExplain(_ => {
          return defaultExplain.filter(element => {
            return element[fieldName].includes(event.target.value)
          })
        })
      }
    },
    [defaultExplain]
  )

  const sort = useCallback((fieldName = 'path') => {
    return order => {
      let localOrder = order
      if (!order || order === 0) {
        return
      } else if (order >= 1) {
        localOrder = 1
      } else {
        localOrder = -1
      }
      setExplain(prevExplain => {
        return prevExplain.slice().sort((a, b) => {
          return (
            localOrder *
            `${a[fieldName]}`.localeCompare(`${b[fieldName]}`, undefined, {
              numeric: fieldName !== 'path'
            })
          )
        })
      })
    }
  }, [])

  const changePathOrder = useCallback(() => {
    if (pathOrder !== 0) {
      setPathOrder(prev => -prev)
    } else {
      setPathOrder(1)
    }
    setTimeOrder(0)
    setTotalOrder(0)
  }, [pathOrder])

  const changeTimeOrder = useCallback(() => {
    if (timeOrder !== 0) {
      setTimeOrder(prev => -prev)
    } else {
      setTimeOrder(1)
    }
    setPathOrder(0)
    setTotalOrder(0)
  }, [timeOrder])

  const changeTotalOrder = useCallback(() => {
    if (totalOrder !== 0) {
      setTotalOrder(prev => -prev)
    } else {
      setTotalOrder(1)
    }
    setTimeOrder(0)
    setPathOrder(0)
  }, [totalOrder])

  useEffect(() => {
    const sortPath = sort('path')
    sortPath(pathOrder)
  }, [pathOrder, sort])

  useEffect(() => {
    const sortTime = sort('time')
    sortTime(timeOrder)
  }, [timeOrder, sort])

  useEffect(() => {
    const sortTotal = sort('totalTime')
    sortTotal(totalOrder)
  }, [totalOrder, sort])

  // TODO: Find way to proper estimate the thresholds below
  const timeThresholdMs = 100
  const totalThresholdMs = 300

  return {
    explain,
    searchByPath: searchByField('path'),
    changePathOrder,
    changeTimeOrder,
    changeTotalOrder,
    timeOrder,
    pathOrder,
    totalOrder,
    timeThresholdMs,
    totalThresholdMs
  }
}
