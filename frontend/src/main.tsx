import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


import { BrowserRouter as router } from "react-router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <App />
  </StrictMode>,
)
