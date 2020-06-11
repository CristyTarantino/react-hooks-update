import React from 'react'

import Card from '../UI/Card'
import styles from './IngredientForm.module.scss'

const IngredientForm = React.memo((props) => {
  const submitHandler = (event) => {
    event.preventDefault()
    // ...
  }

  return (
    <section className={styles['ingredient-form']}>
      <Card>
        <form onSubmit={submitHandler}>
          <div className={styles['form-control']}>
            <label htmlFor="title">Name</label>
            <input type="text" id="title" />
          </div>
          <div className={styles['form-control']}>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" />
          </div>
          <div className={styles['ingredient-form__actions']}>
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  )
})

export default IngredientForm
