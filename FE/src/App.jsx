import { useState } from 'react'
// import './App.css'
import Header from './components/layout/Header'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/Home'

function App() {
  return (
    <>
      <Header/>
      <Navbar/>

      <HomePage/>

      <Footer/>
    </>
  )
}

export default App
