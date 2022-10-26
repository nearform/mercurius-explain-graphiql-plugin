import { useState } from 'react'
import { Profiler } from '../components/Profiler'
import { ResolverCalls } from '../components/ResolverCalls'
import explainDataManager from '../ExplainDataManager'

export const tabs = {
  profiler: {
    label: 'Profiler',
    renderComponent: props => <Profiler {...props} />
  },
  resolverCalls: {
    label: 'Resolver Calls',
    renderComponent: props => <ResolverCalls {...props} />
  }
}

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
