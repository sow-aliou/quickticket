import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Déconnexion uniquement au premier lancement (pas lors des rechargements F5)
// sessionStorage est réinitialisé à chaque ouverture de nouvel onglet/fenêtre
// mais persiste lors d'un simple refresh.
if (!sessionStorage.getItem('appInitialized')) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.setItem('appInitialized', 'true');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
