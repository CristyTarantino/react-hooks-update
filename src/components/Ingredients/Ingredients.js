import React, {useReducer, useState, useCallback} from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload.ingredients
    case 'ADD':
      return [...currentIngredients, action.payload.ingredient]
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.payload.id)
    default:
      throw new Error('Should not get there!')
  }
}

const Ingredients = () => {
  const [ingredientList, dispatch] = useReducer(ingredientReducer, [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true)
    fetch('https://react-burger-tio.firebaseio.com/stock.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    })
      .then((res) => {
        const data = res.json()
        setIsLoading(false)
        dispatch({
          type: 'ADD',
          payload: {
            ingredient: {id: data.name, ...ingredient},
          },
        })
      })
      .catch((err) => {
        console.log('Error: ', err)
        // even if there are two synchronous set state  React will batch them
        // so that it re-renders the component only once
        setError(err.message)
        setIsLoading(false)
      })
  }

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true)
    fetch(`https://react-burger-tio.firebaseio.com/stock/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(() => {
        setIsLoading(false)
        dispatch({
          type: 'DELETE',
          payload: {
            id: ingredientId,
          },
        })
      })
      .catch((err) => {
        console.log('Error: ', err)
        // even if there are two synchronous set state  React will batch them
        // so that it re-renders the component only once
        setError(err.message)
        setIsLoading(false)
      })
  }

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: 'SET',
      payload: {
        ingredients: filteredIngredients,
      },
    })
  }, [])

  const clearErrorHandler = () => {
    setError(null)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

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

/*
 * N.B.:
 * React batches state updates - see: https://github.com/facebook/react/issues/10231#issuecomment-316644950
 *
 * That simply means that calling
 *
 * setName('Max');
 * setAge(30);
 * in the same synchronous (!) execution cycle (e.g. in the same function) will NOT trigger two component re-render cycles.
 *
 * Instead, the component will only re-render once and both state updates will be applied simultaneously.
 *
 *  Not directly related, but also sometimes misunderstood, is when the new state value is available.
 *
 *  Consider this code:
 *
 *  console.log(name); // prints name state, e.g. 'Manu'
 *  setName('Max');
 *  console.log(name); // ??? what gets printed? 'Max'?
 *  You could think that accessing the name state after setName('Max'); should yield the new value (e.g. 'Max') but this is NOT the case. Keep in mind, that the new state value is only available in the next component render cycle (which gets scheduled by calling setName()).
 *
 *  Both concepts (batching and when new state is available) behave in the same way for both functional components with hooks as well as class-based components with this.setState()!
 *
 */
