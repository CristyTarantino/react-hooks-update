import React, {useState} from 'react'

import Card from '../UI/Card'
import LoadingIndicator from '../UI/LoadingIndicator'
import styles from './IngredientForm.module.scss'

const IngredientForm = ({title, amount, onAddIngredient, loading}) => {
  const [inputTitle, setInputTitle] = useState(title || '')
  const [inputAmount, setInputAmount] = useState(amount || '')

  const submitHandler = (event) => {
    event.preventDefault()
    onAddIngredient({title: inputTitle, amount: inputAmount})
  }

  return (
    <section className={styles['ingredient-form']}>
      <Card>
        <form onSubmit={submitHandler}>
          <div className={styles['form-control']}>
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputTitle}
              onChange={(event) => setInputTitle(event.target.value)}
            />
          </div>
          <div className={styles['form-control']}>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputAmount}
              onChange={(event) => setInputAmount(event.target.value)}
            />
          </div>
          <div className={styles['ingredient-form__actions']}>
            <button type="submit">Add Ingredient</button>
            {loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  )
}

export default React.memo(IngredientForm)
