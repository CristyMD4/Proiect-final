import { useState } from 'react'
import Book from './pages/Book'
import { Routes } from 'react-router-dom'
import Contact from './pages/Contact'

function App() {
  return (
   <Routes>
      <Route path="/book" element={<Book />}/>
      <Route path="/contact" elemenet={<Contact />}/>
   </Routes>
  )
}

export default App