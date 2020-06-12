import React, {useEffect, useState, useRef} from 'react'

import Card from '../UI/Card'
import styles from './Search.module.scss'
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'

const Search = ({onLoadIngredients}) => {
  const [inputFilter, setInputFilter] = useState('')
  const inputRef = useRef()
  const {isLoading, data, error, sendRequest, clear} = useHttp()

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = Object.keys(data).map((id) => ({id, ...data[id]}))
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputFilter === inputRef.current.value) {
        const query =
          inputFilter.length === 0
            ? ''
            : `?orderBy="title"&startAt="${inputFilter}"&endAt="${inputFilter}\uf8ff"&once="value"`

        sendRequest('https://react-burger-tio.firebaseio.com/stock.json' + query, 'GET')
      }
    }, 500)

    // componentDidUnmount
    return () => {
      clearTimeout(timer)
    }
  }, [inputFilter, inputRef, sendRequest])

  return (
    <section className={styles['search']}>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className={styles['search-input']}>
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type="text"
            value={inputFilter}
            ref={inputRef}
            onChange={(event) => setInputFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  )
}

export default React.memo(Search)
