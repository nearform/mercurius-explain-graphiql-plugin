import { useCallback, useEffect, useState, useMemo } from 'react'
import { explainDataManager } from '../ExplainDataManager'
import { appendTotalsToExplainResponse } from '../utils'

export const useProfiler = () => {
  const initialProfiler = useMemo(
    () => appendTotalsToExplainResponse(explainDataManager.getProfilerData()),
    []
  )
  const [profiler, setProfiler] = useState(initialProfiler)
  const [defaultProfiler, setDefaultProfiler] = useState(initialProfiler)
  const [pathOrder, setPathOrder] = useState(0)
  const [timeOrder, setTimeOrder] = useState(0)
  const [totalOrder, setTotalOrder] = useState(0)
  const [limits, setLimits] = useState({
    time: 0,
    totalTime: 0,
    totalBegin: Number.MAX_VALUE,
    pathLength: 0
  })

  useEffect(() => {
    setLimits(
      defaultProfiler.reduce(
        (acc, curr) => {
          if (curr.time > acc.time) {
            acc.time = curr.time
          }
          if (curr.totalTime > acc.totalTime) {
            acc.totalTime = curr.totalTime
          }
          if (curr.totalBegin < acc.totalBegin) {
            acc.totalBegin = curr.totalBegin
          }
          if (curr.path.length > acc.pathLength) {
            acc.pathLength = curr.path.length
          }

          return acc
        },
        { time: 0, totalTime: 0, totalBegin: Number.MAX_VALUE, pathLength: 0 }
      )
    )
  }, [defaultProfiler])

  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        const profilerDataWithTotal = appendTotalsToExplainResponse(
          e.target.explainData.profiler
        )
        setDefaultProfiler(() => profilerDataWithTotal || [])
        setProfiler(_ => profilerDataWithTotal || [])
      }
    )
    return () => {
      explainDataManager.removeEventListener('updateExplainData', eventListener)
    }
  }, [])

  const searchByField = useCallback(
    fieldName => {
      return event => {
        setProfiler(_ => {
          return defaultProfiler.filter(element => {
            return element[fieldName].includes(event.target.value)
          })
        })
      }
    },
    [defaultProfiler]
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
      setProfiler(prevProfiler => {
        return prevProfiler.slice().sort((a, b) => {
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
    if (pathOrder) {
      const sortPath = sort('path')
      sortPath(pathOrder)
    }
  }, [pathOrder, sort])

  useEffect(() => {
    if (timeOrder) {
      const sortTime = sort('time')
      sortTime(timeOrder)
    }
  }, [timeOrder, sort])

  useEffect(() => {
    if (totalOrder) {
      const sortTotal = sort('totalTime')
      sortTotal(totalOrder)
    }
  }, [totalOrder, sort])

  return {
    profiler,
    searchByPath: searchByField('path'),
    changePathOrder,
    changeTimeOrder,
    changeTotalOrder,
    timeOrder,
    pathOrder,
    totalOrder,
    limits
  }
}
