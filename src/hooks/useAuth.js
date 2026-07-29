import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLogin(username, password) {
  return useMutation({
    mutationFn: async ({ username, password }) => {
      //console.log ("username : "+username+" ==== password : "+password)
      // Appel vers le point de terminaison d'authentification de votre ERP
        const response = await api.post("/api/auth/login", {
        username,
        password //,
        //client // Envoi du Mandant/Client SAP si requis par votre backend
      })
      
      // La réponse attendue du serveur doit être un objet contenant le token, ex: { token: "eyJhbGci..." }
      return response.data
    }
  })
}