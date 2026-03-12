import { useState } from 'react'
import Book from './pages/Book'
import { Routes } from 'react-router-dom'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'

function App() {
  return (
   <Routes>
      <Route path="/book" element={<Book />}/>
      <Route path="/contact" elemenet={<Contact />}/>
      <Route path="/gallery" elemenet={<Gallery />}/>
   </Routes> 
  )
}

export default App