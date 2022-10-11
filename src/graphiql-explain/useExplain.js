import { useEffect, useState } from 'react'
import { explainDataManager } from './ExplainDataManager'

export const useExplain = () => {
  const [explain, setExplain] = useState(explainDataManager.getExplainData())
  useEffect(() => {
    const eventListener = explainDataManager.addEventListener(
      'updateExplainData',
      (e, value) => {
        setExplain(_ => e.target.explainData || [])
      }
    )
    return () => {
      explainDataManager.removeEventListener('updateExplainData', eventListener)
    }
  }, [])
  return { explain }
}
