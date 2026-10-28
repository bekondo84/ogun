import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './i18n'

const queryClient = new QueryClient({
    defaultOptions: {
       queries: {
          refetchOnWindowFocus: false, //Eviter de charger l'API des qu'on change d'onglet de navigateur
          staleTime: 1000*60*5, //Considère la donnée comme "fraîche" pendant 5 minutes (évite les requêtes doublons)
        }
    },
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
