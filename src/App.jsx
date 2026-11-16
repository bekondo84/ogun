import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import { Toaster } from 'sonner'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './components/pages/security/LoginPage'
import AppsPage from './components/pages/plugins/AppsPage'
import PluginFormPage from './components/pages/plugins/PluginFormPage'
import { useOdooModal } from './components/widgets/notification/useOdooModal'
import { setGlobalModal } from './utils/modalService'
import { useErpStore } from './lib/useErpStore'

function App() {
  const [count, setCount] = useState(0)
  const [modal, ModalElement] = useOdooModal();
  /**
   * NAV_PLUGIN_001 : Plugin Landing Page then Vertical Menu
   * NAV_PLUGIN_002 : Plugin Langing Page then Horizontal Menu
   * NAV_PLUGIN_003 : Global plugin horizontal menu and Vertical menu for plugin details
   */
  const erpTemplate = useErpStore((state) => state.erpTemplate);

  
  useEffect(() => {
      setGlobalModal(modal)
  }, [modal]);

  const showAppsPage = () => {
       //console.log('?????????????????????? : '+erpTemplate)
       return ['NAV_PLUGIN_001', 'NAV_PLUGIN_002'].includes(erpTemplate)
  }
  
  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={4000} />      
      <BrowserRouter>
        <Routes>
          {/* Route par défaut : Page de connexion */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Route après connexion : Tableau de bord des applications */}
          { showAppsPage() ? (<Route path="/apps" element={<AppsPage erpTemplate={erpTemplate} />} />) 
            :(<Route path="/apps" element={<PluginFormPage erpTemplate={erpTemplate}/>} />)}          

          <Route path="/apps/:id" element={<PluginFormPage erpTemplate={erpTemplate}/>} />

        </Routes>
      </BrowserRouter>
      {ModalElement}
    </>
  )
}

export default App
