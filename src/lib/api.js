import { triggerGlobalModal } from "@/utils/modalService"
import axios from "axios"
import { toast } from "sonner"

// 1. Création de l'instance configurée
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
  (response) =>  {
        return response ;
  } ,
  async(error) => {
    const status = error?.status;
    const serverMessage = error?.message;
    //console.log('-------- api.js -------------------'+status+'  --------- '+JSON.stringify(error))
    switch(status) {
       case 401 : //Unauthirized (session expirée ou mauvais token)
           toast.error("Session expirée", {
               description: "Veuillez vous reconnecter.",
           });
           localStorage.removeItem("erp_auth_token");
           window.location.href = "/" ;// Redirection immédiate vers l'écran de Login
           break;
       case 403:
         toast.error("Accès refusé", {
           description: "Vous n'avez pas les permissions pour effectuer cette action",
         });    
         break;
       case 404:
          toast.error("Ressource introuvable", {
          description: serverMessage || "L'élément demandé n'existe pas sur le serveur.",
         });
         break;
       case 500: 
         await triggerGlobalModal({
              title: "Erreur Serveur (500)",
              message: serverMessage,
              variant: "danger",
              confirmText: "Fermer",
              showCancel: false
            });
         /*
         toast.error("Erreur Serveur (500)", {
          description: "Un problème technique est survenu côté serveur. Réessayez plus tard.",
        });*/
        break;
       default:
          toast.error("Erreur de connexion", {
          description: "Impossible de joindre le serveur API. Vérifiez votre réseau.",
        });
        break;
    }
    return Promise.reject(error)
  }
);