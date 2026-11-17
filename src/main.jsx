import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext.jsx'
import { osigurajPocetneRacune } from './services/korisnici/DemoRacuni.js'

// Na praznom pregledniku (nema korisnika u localStorage-u) stvaraju se demo
// računi, inače se nitko ne bi mogao prijaviti.
try {
  await osigurajPocetneRacune()
} catch (greska) {
  console.error('Demo računi nisu stvoreni:', greska)
}

// AuthProvider MORA biti unutar BrowserRoutera (koristi useNavigate),
// a iznad App-a (inače useAuth u stranicama nema svog Providera).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
