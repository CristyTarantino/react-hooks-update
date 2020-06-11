import React from 'react'

import styles from './ErrorModal.module.scss'

const ErrorModal = ({onClose, children}) => {
  return (
    <React.Fragment>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles['error-modal']}>
        <h2>An Error Occurred!</h2>
        <p>{children}</p>
        <div className={styles['error-modal__actions']}>
          <button type="button" onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default React.memo(ErrorModal)
