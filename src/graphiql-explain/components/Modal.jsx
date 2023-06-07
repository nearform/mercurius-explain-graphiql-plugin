import React from 'react'
import styles from './Modal.module.css'
import { ReactComponent as CloseIcon } from '../../icons/close.svg'

export const Modal = ({ isOpen, closeModal, children, title }) => {
  const modalRef = React.useRef(null)

  const handleClickOutside = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal()
    }
  }

  return isOpen ? (
    <div className={styles.modalWrapper} onClick={handleClickOutside}>
      <div className={styles.container} ref={modalRef}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} onClick={closeModal}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  ) : null
}
