import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLogin } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User, Globe, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")

    //Retire le token du localstorage
    localStorage.removeItem("erp_auth_token"); 
    
    // On utilise directement l'état de la mutation TanStack Query
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          // 🔐 Stockage du token de session ERP
          //console.log(data);
          if (data?.access_token) {
            localStorage.setItem("erp_auth_token", data.access_token)
           // console.log('Hey this is the tolen store :: '+data.access_token);            
          }
          navigate("/apps")
        },
        onError: (error) => {
          // Formatage du message d'erreur provenant de votre API REST
          const apiError = error.response?.data?.message || "Identifiants ou Mot de passe incorrects."
          setErrorMessage(apiError)
        }
      }
    )
  }

  return (
    // Fond dégradé linéaire SAP Fiori (Belize/Quartz mix)
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#e9f0f5] to-[#cedee7] p-4 text-[#333333] antialiased">
      
      <div className="w-full max-w-[380px] space-y-4">
        
        {/* En-tête Institutionnel SAP Fiori */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <h1 className="text-2xl font-light tracking-tight text-[#002a54]">
             <span className="font-semibold text-[#0a6ed1]">OGUN</span>SAP
          </h1>
          <p className="text-xs text-[#556b82] font-medium tracking-wide">
            Cloud for Customer Login
          </p>
        </div>

        {/* Boîte Blanche SAP Fiori Style */}
        <Card className="border border-[#cbdbe5] bg-white shadow-xl shadow-slate-300/40 rounded-[4px]">
          <CardContent className="p-8 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ⚠️ BANDEAU DE NOTIFICATION D'ÉCHEC (Style SAP Alert Message) */}
              {errorMessage && (
                <div className="p-3 border border-red-200 bg-red-50 text-red-700 text-xs font-semibold rounded-[4px] flex items-start gap-2 animate-in fade-in zoom-in-95 duration-150">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <span className="block font-bold">Échec de la connexion</span>
                    <span className="block text-[11px] font-medium opacity-90 mt-0.5">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Champ : Utilisateur */}
              <div className="space-y-1">
                <Label htmlFor="username" className="text-xs font-semibold text-[#556b82]">
                  Utilisateur
                </Label>
                <div className="relative flex items-center border-b border-[#a3b8cc] focus-within:border-[#0a6ed1] transition-colors">
                  <div className="flex h-10 w-9 items-center justify-center text-[#6a7d91] border-r border-[#e0e7ed] mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  {/* CORRECTION : Ajout de value et onChange pour capturer le texte */}
                  <Input
                    id="username"
                    type="text"
                    placeholder="Identifiant"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loginMutation.isPending}
                    className="h-10 w-full border-none bg-transparent px-0 text-sm text-[#333] placeholder:text-[#a0b2c6] focus-visible:ring-0 shadow-none rounded-none"
                  />
                </div>
              </div>

              {/* Champ : Mot de passe */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold text-[#556b82]">
                  Mot de passe
                </Label>
                <div className="relative flex items-center border-b border-[#a3b8cc] focus-within:border-[#0a6ed1] transition-colors">
                  <div className="flex h-10 w-9 items-center justify-center text-[#6a7d91] border-r border-[#e0e7ed] mr-2">
                    <Lock className="h-4 w-4" />
                  </div>
                  {/* CORRECTION : Ajout de value et onChange pour capturer le mot de passe */}
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loginMutation.isPending}
                    className="h-10 w-full border-none bg-transparent px-0 text-sm text-[#333] placeholder:text-[#a0b2c6] focus-visible:ring-0 shadow-none rounded-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 text-[#6a7d91] hover:text-[#333] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Liens secondaires */}
              <div className="flex items-center justify-between pt-1 text-xs font-medium">
                <a href="#" className="text-[#0a6ed1] hover:text-[#0854a0] hover:underline">
                  Changer le mot de passe
                </a>
                <a href="#" className="text-[#556b82] hover:text-[#333] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton SAP Log On Dynamique */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#0a6ed1] hover:bg-[#0854a0] active:bg-[#063b70] text-white font-medium rounded-[4px] shadow-sm tracking-wide text-sm transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authentification...</span>
                  </>
                ) : (
                  "Log On"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sélecteur de langue en pied de page */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#556b82] pt-2">
          <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-[#6a7d91]" />
            <span>Langue :</span>
          </div>
          <select className="bg-transparent border-none text-[#0a6ed1] font-semibold cursor-pointer outline-none focus:underline">
            <option value="fr">Français (FR)</option>
            <option value="en">English (EN)</option>
            <option value="de">Deutsch (DE)</option>
          </select>
        </div>

      </div>
    </div>
  )
}