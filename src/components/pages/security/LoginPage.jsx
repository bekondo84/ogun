import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User, Layers, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate() // ✨ Initialisation du routeur

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulation d'une vérification d'authentification ERP
    setTimeout(() => {
      setIsLoading(false)
      navigate("/apps") // ✨ Redirection automatique vers le Dashboard
    }, 1500)
  }

  return (
    // Fond dégradé linéaire SAP Fiori (Belize/Quartz mix)
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#e9f0f5] to-[#cedee7] p-4 text-[#333333] antialiased">
      
      <div className="w-full max-w-[380px] space-y-1">
        
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
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Champ 2 : Utilisateur */}
              <div className="space-y-1">
                <Label htmlFor="username" className="text-xs font-semibold text-[#556b82]">
                  Utilisateur
                </Label>
                <div className="relative flex items-center border-b border-[#a3b8cc] focus-within:border-[#0a6ed1] transition-colors">
                  <div className="flex h-10 w-9 items-center justify-center text-[#6a7d91] border-r border-[#e0e7ed] mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Identifiant"
                    required
                    disabled={isLoading}
                    className="h-10 w-full border-none bg-transparent px-0 text-sm text-[#333] placeholder:text-[#a0b2c6] focus-visible:ring-0 shadow-none rounded-none"
                  />
                </div>
              </div>

              {/* Champ 3 : Mot de passe */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold text-[#556b82]">
                  Mot de passe
                </Label>
                <div className="relative flex items-center border-b border-[#a3b8cc] focus-within:border-[#0a6ed1] transition-colors">
                  <div className="flex h-10 w-9 items-center justify-center text-[#6a7d91] border-r border-[#e0e7ed] mr-2">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="h-10 w-full border-none bg-transparent px-0 text-sm text-[#333] placeholder:text-[#a0b2c6] focus-visible:ring-0 shadow-none rounded-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 text-[#6a7d91] hover:text-[#333]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Bloc de récupération : Boutons discrets sous les inputs */}
              <div className="flex items-center justify-between pt-1 text-xs font-medium">
                <a href="#" className="text-[#0a6ed1] hover:text-[#0854a0] hover:underline">
                  Changer le mot de passe
                </a>
                <a href="#" className="text-[#556b82] hover:text-[#333] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton SAP Fiori Traditionnel (Bleu unifié, angles droits 4px) */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#0a6ed1] hover:bg-[#0854a0] active:bg-[#063b70] text-white font-medium rounded-[4px] shadow-sm tracking-wide text-sm transition-all mt-4" 
                disabled={isLoading}
              >
                {isLoading ? "Authentification en cours..." : "Log On"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sélecteur de langue en pied de page */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#556b82]">
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
