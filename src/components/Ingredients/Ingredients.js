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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null}
    case 'SUCCESS':
      return {...currentHttpState, loading: false}
    case 'FAILURE':
      return {loading: false, error: action.payload.errorMessage}
    case 'CLEAR':
      return {...currentHttpState, error: null}
    default:
      throw new Error('Should not get there!')
  }
}

const Ingredients = () => {
  const [ingredientList, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  })

  const addIngredientHandler = (ingredient) => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-burger-tio.firebaseio.com/stock.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'},
    })
      .then((res) => {
        const data = res.json()
        dispatchHttp({type: 'SUCCESS'})
        dispatch({
          type: 'ADD',
          payload: {
            ingredient: {id: data.name, ...ingredient},
          },
        })
      })
      .catch((err) => {
        console.log('Error: ', err)
        dispatchHttp({type: 'FAILURE', payload: {errorMessage: err.message}})
      })
  }

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({type: 'SEND'})
    fetch(`https://react-burger-tio.firebaseio.com/stock/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(() => {
        dispatchHttp({type: 'SUCCESS'})
        dispatch({
          type: 'DELETE',
          payload: {
            id: ingredientId,
          },
        })
      })
      .catch((err) => {
        console.log('Error: ', err)
        dispatchHttp({type: 'FAILURE', payload: {errorMessage: err.message}})
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
    dispatchHttp({type: 'CLEAR'})
  }

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearErrorHandler}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

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
