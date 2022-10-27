import { useState } from 'react'
import explainDataManager from '../ExplainDataManager'

export const useTabs = () => {
  const [currentTab, setCurrentTab] = useState(
    explainDataManager.getCurrentTab()
  )

  const setNewCurrentTab = newTab => {
    setCurrentTab(newTab)
    explainDataManager.setCurrentTab(newTab)
  }

  return { setCurrentTab: setNewCurrentTab, currentTab }
}
