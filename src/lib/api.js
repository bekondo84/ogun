import axios from "axios"

// 🚀 1. Création de l'instance configurée
export const api = axios.create({
  baseURL: "http://localhost:8080", // Remplacez par l'URL de votre serveur REST API
  timeout: 10000, // Coupe la requête si le serveur ne répond pas après 10 secondes
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔐 2. L'Intercepteur Sécurité : Injecte le jeton d'authentification à la volée
api.interceptors.request.use(
  (config) => {
    // Récupère le token stocké lors du processus de connexion (ex: localStorage ou état)
    const token = localStorage.getItem("erp_auth_token")
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 🛡️ 3. L'Intercepteur Erreur : Déconnecte automatiquement si le jeton a expiré (Erreur 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("erp_auth_token")
      window.location.href = "/" // Redirection immédiate vers l'écran de Login
    }
    return Promise.reject(error)
  }
)