import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
             position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#333",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "12px 16px"
                    }
                }} />
    </BrowserRouter>
  </React.StrictMode>,
)
