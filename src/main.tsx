import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Global styles first, so component CSS Modules can override them.
import './styles/global.scss'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
