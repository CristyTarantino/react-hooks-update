import React, {useContext} from 'react'
import Ingredients from './components/Ingredients/Ingredients'
import {AuthContext} from './context/auth-context'
import Auth from './components/Auth'

const App = () => {
  const authContext = useContext(AuthContext)

  let content = <Auth />

  if (authContext.isAuth) {
    content = <Ingredients />
  }

  return (
    <>
      <h1>Burger Builder eCommerce Back Office</h1>
      {content}
    </>
  )
}

export default App
