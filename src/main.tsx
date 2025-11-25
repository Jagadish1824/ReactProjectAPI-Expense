import { createRoot } from 'react-dom/client'
import { store } from './store/store'
import { loadUserFromStorage } from './store/authSlice'
import './index.css'
import App from './App.tsx'

// Load user from localStorage on app start
store.dispatch(loadUserFromStorage());

createRoot(document.getElementById('root')!).render(
  <App />
)
