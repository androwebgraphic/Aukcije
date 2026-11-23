import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext.jsx'
import { LoadingProvider } from './components/LoadingContext.jsx'
import {ModalProvider} from "./components/ModalContext.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
   
      <AuthProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
      </AuthProvider>
</LoadingProvider>

    </BrowserRouter>
   
  </StrictMode>
)
