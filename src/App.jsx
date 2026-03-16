import Book from './pages/Book'
import { Routes } from 'react-router-dom'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'

import AdminLayout from "./layouts/AdminLayout.jsx";
import SiteLayout from "./layouts/SiteLayout.jsx";
import AdminLogin from './admin/AdminLogin.jsx';
import AdminBookings from "./admin/Bookings.jsx";
import AdminDashboard from "./admin/Dashboard.jsx";
import AdminLocations from "./admin/Locations.jsx";
import AdminMessages from "./admin/Messages.jsx";
import AdminTestimonials from "./admin/Testimonials.jsx";

function App() {
  return (
   <Routes>
      <Route element={<SiteLayout/>}>
        <Route path="/book" element={<Book />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/gallery" element={<Gallery />}/>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/services" element={<Services />} />
        <Route patch="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="locations" element={<AdminLocations />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="testimonials" element={<AdminTestimonials />} />

        <Route path="/admin" element={<AdminLayout />}>

        </Route>

   </Routes> 
  )
}

export default App