import React, { Fragment } from 'react'
import { tabs } from '../hooks/useTabs'
import styles from './Tabs.module.css'

export const Tabs = ({ handleTabClick, currentTab }) => {
  return (
    <Fragment>
      <nav className={styles.nav}>
        {Object.entries(tabs).map(([key, value]) => {
          return (
            <div
              key={key}
              onClick={() => handleTabClick(key)}
              className={
                currentTab === key
                  ? `${styles.currentTab} ${styles.tab}`
                  : styles.tab
              }
            >
              {value.label}
            </div>
          )
        })}
      </nav>
      <div className={styles.divider} />
    </Fragment>
  )
}
