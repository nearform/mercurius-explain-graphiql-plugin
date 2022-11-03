import React, { forwardRef } from 'react'
import styles from './Tooltip.module.css'

export const Tooltip = forwardRef((_, ref) => (
  <div className={styles.container} ref={ref}>
    <div className={styles.content} />
  </div>
))

Tooltip.displayName = 'Tooltip'
