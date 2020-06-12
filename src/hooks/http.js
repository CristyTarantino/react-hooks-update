import {useReducer, useCallback} from 'react'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
}

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.payload.identifier,
      }
    case 'SUCCESS':
      return {
        ...currentHttpState,
        loading: false,
        data: action.payload.data,
        extra: action.payload.extra,
      }
    case 'FAILURE':
      return {loading: false, error: action.payload.errorMessage}
    case 'CLEAR':
      return initialState
    default:
      throw new Error('Should not get there!')
  }
}

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

  const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), [])

  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({type: 'SEND', payload: {identifier: reqIdentifier}})

    fetch(url, {
      method: method,
      body: body,
      headers: {'Content-Type': 'application/json'},
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        dispatchHttp({type: 'SUCCESS', payload: {data: data, extra: reqExtra}})
      })
      .catch((err) => {
        console.log('Error: ', err)
        dispatchHttp({type: 'FAILURE', payload: {errorMessage: err.message}})
      })
  }, [])

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear,
  }
}

export default useHttp
