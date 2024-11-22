import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './firebase/authContext.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
<BrowserRouter future={{ v7_relativeSplatPath: true }} >
<AuthProvider>

    <App />

</AuthProvider>

</BrowserRouter>
    

  </StrictMode>,
)
