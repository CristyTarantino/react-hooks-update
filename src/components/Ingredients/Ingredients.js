import React, {useState} from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
  const [ingredientList, setIngredientList] = useState([])

  const addIngredientHandler = (ingredient) => {
    setIngredientList((prevState) => [
      ...prevState,
      {id: `${prevState.length + 1}_${Math.random().toString()}`, ...ingredient},
    ])
  }

  const removeIngredientHandler = (ingredientId) => {
    setIngredientList((prevState) => prevState.filter((ing) => ingredientId !== ing.id))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredientList}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  )
}

export default Ingredients
