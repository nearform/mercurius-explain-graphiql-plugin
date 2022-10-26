import { useState, useEffect, useCallback, useMemo } from 'react'
import explainDataManager from '../ExplainDataManager'

export const useResolverCalls = () => {
  const initialResolverCalls = useMemo(
    () => explainDataManager.getResolverCallsData(),
    []
  )
  const [resolverCalls, setResolverCalls] = useState(initialResolverCalls)
  const [defaultResolverCalls, setDefaultResolverCalls] =
    useState(initialResolverCalls)
  const [keyOrder, setKeyOrder] = useState(0)
  const [countOrder, setCountOrder] = useState(0)

  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        const resolverCalls = e.target.explainData.resolverCalls

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

  const sort = useCallback((fieldName = 'key') => {
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
              numeric: fieldName !== 'key'
            })
          )
        })
      })
    }
  }, [])

  const changeKeyOrder = useCallback(() => {
    if (keyOrder !== 0) {
      setKeyOrder(prev => -prev)
    } else {
      setKeyOrder(1)
    }
    setCountOrder(0)
  }, [keyOrder])

  const changeCountOrder = useCallback(() => {
    if (countOrder !== 0) {
      setCountOrder(prev => -prev)
    } else {
      setCountOrder(1)
    }
    setKeyOrder(0)
  }, [countOrder])

  useEffect(() => {
    if (keyOrder) {
      const sortKey = sort('key')
      sortKey(keyOrder)
    }
  }, [keyOrder, sort])

  useEffect(() => {
    if (countOrder) {
      const sortCount = sort('count')
      sortCount(countOrder)
    }
  }, [countOrder, sort])

  return {
    resolverCalls,
    searchByKey: searchByField('key'),
    countOrder,
    changeCountOrder,
    keyOrder,
    changeKeyOrder
  }
}
