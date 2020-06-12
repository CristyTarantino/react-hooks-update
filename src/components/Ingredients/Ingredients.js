import React, {useState, useCallback} from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
  const [ingredientList, setIngredientList] = useState([])

  const addIngredientHandler = async (ingredient) => {
    let data = await fetch('https://react-burger-tio.firebaseio.com/stock.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    })
      .then((res) => {
        return res.json()
      })
      .catch((err) => {
        console.log('Error: ', err)
      })

    setIngredientList((prevState) => [...prevState, {id: data.name, ...ingredient}])
  }

  const removeIngredientHandler = async (ingredientId) => {
    await fetch(`https://react-burger-tio.firebaseio.com/stock/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(() => {
        setIngredientList((prevState) =>
          prevState.filter((ing) => ingredientId !== ing.id)
        )
      })
      .catch((err) => {
        console.log('Error: ', err)
      })
  }

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredientList(filteredIngredients)
  }, [])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredientList}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  )
}

export default Ingredients
