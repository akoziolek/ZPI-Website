import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> // re-run refs callbacks an extra time, re-run Effects an extra time, be checked for usage of deprecated APIs.
    <BrowserRouter>
        <App />
    </BrowserRouter>
  // </StrictMode>,
)
