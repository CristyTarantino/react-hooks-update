import React from 'react'

import Card from '../UI/Card'
import styles from './Search.module.scss'

const Search = React.memo((props) => {
  return (
    <section className={styles['search']}>
      <Card>
        <div className={styles['search-input']}>
          <label>Filter by Title</label>
          <input type="text" />
        </div>
      </Card>
    </section>
  )
})

export default Search
