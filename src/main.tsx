import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AdminAuthProvider, MemberAuthProvider } from './lib/auth'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <MemberAuthProvider>
        <App />
      </MemberAuthProvider>
    </AdminAuthProvider>
  </React.StrictMode>
)
