import { useState, useEffect, useCallback, useMemo } from 'react'
import explainDataManager from '../ExplainDataManager'
import { resolverCallMapper } from '../utils'

export const useResolverCalls = () => {
  const initialResolverCalls = useMemo(
    () => resolverCallMapper(explainDataManager.getResolverCallsData()),
    []
  )
  const [resolverCalls, setResolverCalls] = useState(initialResolverCalls)
  const [defaultResolverCalls, setDefaultResolverCalls] =
    useState(initialResolverCalls)
  const [pathOrder, setPathOrder] = useState(0)
  const [countOrder, setCountOrder] = useState(0)

  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        const resolverCalls = resolverCallMapper(
          e.target.explainData.resolverCalls
        )

        setDefaultResolverCalls(() => resolverCalls || [])
        setResolverCalls(_ => resolverCalls || [])
      }
    )
    return () => {
      explainDataManager.removeEventListener('updateExplainData', eventListener)
    }
  }, [])

  const searchByField = useCallback(
    fieldName => {
      return event => {
        setResolverCalls(_ => {
          return defaultResolverCalls.filter(element => {
            return element[fieldName].includes(event.target.value)
          })
        })
      }
    },
    [defaultResolverCalls]
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
      setResolverCalls(prevResolverCalls => {
        return prevResolverCalls.slice().sort((a, b) => {
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
    setCountOrder(0)
  }, [pathOrder])

  const changeCountOrder = useCallback(() => {
    if (countOrder !== 0) {
      setCountOrder(prev => -prev)
    } else {
      setCountOrder(1)
    }
    setPathOrder(0)
  }, [countOrder])

  useEffect(() => {
    if (pathOrder) {
      const sortPath = sort('path')
      sortPath(pathOrder)
    }
  }, [pathOrder, sort])

  useEffect(() => {
    if (countOrder) {
      const sortCount = sort('count')
      sortCount(countOrder)
    }
  }, [countOrder, sort])

  return {
    resolverCalls,
    searchByPath: searchByField('path'),
    countOrder,
    changeCountOrder,
    pathOrder,
    changePathOrder
  }
}
