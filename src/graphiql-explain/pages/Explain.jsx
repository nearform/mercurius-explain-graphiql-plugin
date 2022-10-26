import React from 'react'
import { Tabs } from '../components/Tabs'
import { useTabs, tabs } from '../hooks/useTabs'
import { ReactComponent as StopwatchIcon } from '../../icons/stopwatch.svg'
import styles from './Explain.module.css'

export function Content() {
  const { currentTab, setCurrentTab } = useTabs()
  const { renderComponent } = tabs[currentTab]

  return (
    <div className={styles.container}>
      <Tabs handleTabClick={setCurrentTab} currentTab={currentTab} />
      <div>{renderComponent()}</div>
    </div>
  )
}
export function Icon() {
  return <StopwatchIcon fill="currentColor" data-testid="plugin-icon" />
}
