import { useEffect, useState } from 'react'
import { explainDataManager } from './ExplainDataManager'

export const useExplain = () => {
  const [explain, setExplain] = useState(explainDataManager.getExplainData())
  const [defaultExplain, setDefaultExplain] = useState(
    explainDataManager.getExplainData()
  )
  const [pathOrder, setPathOrder] = useState(0)
  const [timeOrder, setTimeOrder] = useState(0)

  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        setDefaultExplain(() => e.target.explainData || [])
        setExplain(_ => e.target.explainData || [])
      }
    )
    return () => {
      explainDataManager.removeEventListener('updateExplainData', eventListener)
    }
  }, [])

  const searchByField = fieldName => {
    return event => {
      setExplain(_ => {
        return defaultExplain.filter(element => {
          return element[fieldName].includes(event.target.value)
        })
      })
    }
  }

  const sort = (fieldName = 'path') => {
    return order => {
      let localOrder = order
      if (!order || order === 0) {
        return explain
      } else if (order >= 1) {
        localOrder = 1
      } else {
        localOrder = -1
      }
      setExplain(_ => {
        return explain.sort((a, b) => {
          return localOrder * `${a[fieldName]}`.localeCompare(`${b[fieldName]}`)
        })
      })
    }
  }

  const sortPath = sort('path')
  const sortTime = sort('time')

  const changePathOrder = () => {
    if (pathOrder !== 0) {
      setPathOrder(prev => -prev)
    } else {
      setPathOrder(1)
    }
    setTimeOrder(0)
  }

  const changeTimeOrder = () => {
    if (timeOrder !== 0) {
      setTimeOrder(prev => -prev)
    } else {
      setTimeOrder(1)
    }
    setPathOrder(0)
  }
  useEffect(() => {
    sortPath(pathOrder)
  }, [pathOrder, sortPath])

  useEffect(() => {
    sortTime(timeOrder)
  }, [timeOrder, sortTime])

  return {
    explain,
    searchByPath: searchByField('path'),
    changePathOrder,
    changeTimeOrder,
    timeOrder,
    pathOrder
  }
}
