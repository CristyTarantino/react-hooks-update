import React, {useEffect, useState, useRef} from 'react'

import Card from '../UI/Card'
import styles from './Search.module.scss'

const Search = ({onLoadIngredients}) => {
  const [inputFilter, setInputFilter] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputFilter === inputRef.current.value) {
        const query =
          inputFilter.length === 0
            ? ''
            : `?orderBy="title"&startAt="${inputFilter}"&endAt="${inputFilter}\uf8ff"&once="value"`
        fetch('https://react-burger-tio.firebaseio.com/stock.json' + query)
          .then((response) => response.json())
          .then((data) => {
            const loadedIngredients = Object.keys(data).map((id) => ({id, ...data[id]}))
            onLoadIngredients(loadedIngredients)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
    }, 500)

    // componentDidUnmount
    return () => {
      clearTimeout(timer)
    }
  }, [inputFilter, onLoadIngredients, inputRef])

  return (
    <section className={styles['search']}>
      <Card>
        <div className={styles['search-input']}>
          <label>Filter by Title</label>
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
