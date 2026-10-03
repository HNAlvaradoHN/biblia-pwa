import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './app/App'
import './app/styles.css'

const root = document.getElementById('root')
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

if (!root) {
  throw new Error('No se encontró el contenedor principal de la aplicación.')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
