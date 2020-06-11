import React from 'react'

import styles from './IngredientList.module.scss'

const IngredientList = (props) => {
  return (
    <section className={styles['ingredient-list']}>
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ig) => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default IngredientList
