import React from 'react'
import styles from './Modal.module.css'

export const Modal = ({ isOpen, closeModal, children }) => {
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
          <button className={styles.closeButton} onClick={closeModal}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  ) : null
}
