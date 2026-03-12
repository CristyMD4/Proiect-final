import { useState } from 'react'
import Book from './pages/Book'
import { Routes } from 'react-router-dom'

function App() {
  return (
   <Routes>
      <Route path="/book" element={<Book />}/>
   </Routes>
  )
}

export default App