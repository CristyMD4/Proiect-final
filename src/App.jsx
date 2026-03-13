import { useState } from 'react'
import Book from './pages/Book'
import { Routes } from 'react-router-dom'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Services from './pages/Services'

import AdminLayout from "./layouts/AdminLayout.jsx";


function App() {
  return (
   <Routes>
      <Route element={<SiteLayout/>}>
        <Route path="/book" element={<Book />}/>
        <Route path="/contact" elemenet={<Contact />}/>
        <Route path="/gallery" elemenet={<Gallery />}/>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/services" element={<Services />} />
    </Route>
        <Route path="/admin" element={<AdminLayout />}>

        </Route>

   </Routes> 
  )
}

export default App