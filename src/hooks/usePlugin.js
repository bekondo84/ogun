import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as LucideIcons from "lucide-react"

export function useGetSessionPlugins() {
    return useQuery({
         queryKey: ["session_plugins"],
         queryFn: async () => {
            const response = await api.post("/api/actions/execute/pluginAction/session_plugins", {});

            // Extraction du tableau de données de l'API Java
            const rawPlugins = response.data?.data || [];
            
            // CORRECTION 2 : On retire le "return" prématuré pour exécuter la transformation
            return rawPlugins.map(plugin => {
                // Évite le bug de casse en s'assurant que le nom commence par une majuscule (PascalCase)
                const formattedIconName = plugin.icon 
                    ? plugin.icon.charAt(0).toUpperCase() + plugin.icon.slice(1) 
                    : "LayoutGrid";

                // Recherche du composant graphique dans la bibliothèque Lucide
                // Si l'icône de la base de données n'existe pas, on applique LayoutGrid par défaut (Sécurité)
                const IconComponent = LucideIcons[formattedIconName] || LucideIcons.LayoutGrid;
                
                return {
                    ...plugin,
                    icon: IconComponent // Devient un composant React valide (ex: <Briefcase />)
                };
              });
         }
    });
}

 export function useGetPluginCategories () {
     return useQuery({
         queryKey: ["plugin_categories"],
         queryFn: async () => {
            const response = await api.post("/api/actions/execute/pluginAction/categories", {});

            // Extraction du tableau de données de l'API Java
            const rawCategories = response.data?.data || [];
            return rawCategories
         }
    }); 
  }

  export function useGetPlugin(id) {
      //console.log('Inside useGetPlugin with id : '+id)
      return useQuery ({
         queryKey: ["load_plugin"],
         queryFn: async () => {
            const response = await api.post("/api/actions/execute/pluginAction/load", {plugin: id})
            const rawPlugin = response.data?.data || null;
            return rawPlugin;
         },
         //N'executer la requête que si id est definie
        // enabled: !!id, 
      });
  }