import React, {useReducer, useCallback, useMemo, useEffect} from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http'

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
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp()

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({
        type: 'DELETE',
        payload: {id: reqExtra},
      })
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        payload: {
          ingredient: {id: data.name, ...reqExtra},
        },
      })
    }
  }, [data, error, isLoading, reqExtra, reqIdentifier])

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        'https://react-burger-tio.firebaseio.com/stock.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      )
    },
    [sendRequest]
  )

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-burger-tio.firebaseio.com/stock/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      )
    },
    [sendRequest]
  )

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: 'SET',
      payload: {
        ingredients: filteredIngredients,
      },
    })
  }, [])

  const clearErrorHandler = useCallback(() => {
    clear()
  }, [clear])

  // example of useMemo however in this case is preferred React.memo
  const ingredientListComponent = useMemo(
    () => (
      <IngredientList
        ingredients={ingredientList}
        onRemoveItem={removeIngredientHandler}
      />
    ),
    [ingredientList, removeIngredientHandler]
  )

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientListComponent}
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
