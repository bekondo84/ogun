import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './components/pages/security/LoginPage'
import AppsPage from './components/pages/plugins/AppsPage'
import PluginFormPage from './components/pages/plugins/PluginFormPage'

function App() {
  const [count, setCount] = useState(0)

  return (
     <BrowserRouter>
      <Routes>
        {/* Route par défaut : Page de connexion */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Route après connexion : Tableau de bord des applications */}
        <Route path="/apps" element={<AppsPage />} />

        <Route path="/apps/:id" element={<PluginFormPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
