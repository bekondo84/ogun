import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Vos dictionnaires de traduction
const resources = {
  fr: {
    translation: {
      unauthorize_action: "Action non autorisé",
      unauthorize_action_message: "Le type d’action sélectionné n’est pas pris en charge par ce type de formulaire.",
      close_btn: "Quitter",
      confirmation_btn: "Confirmer",
      nodata_selected:"Sélection requise",
      nodata_selected_message:"Veuillez sélectionner un élément avant d’exécuter cette action.",
      notification:"Information",
      notification_success:"L'opération s'est terminée avec succès.",
      delete_warn:"Confirmation de suppression",
      delete_warn_message: "Êtes-vous sûr de vouloir supprimer l'élément  ? Cette action est irréversible.",
      create_btn:"Créer",
      delete_btn:"Supprimer",
      cancel_btn:"Annuler",
      logout: "Se déconnecter",
      greeting: "Bonjour, {{name}} !",
      items_count: "Vous avez {{count}} élément | Vous avez {{count}} éléments"
    }
  },
  en: {
    translation: {
      unauthorize_action: "Action not authorized",
      dashboard: "Dashboard",
      settings: "Settings",
      logout: "Log out",
      greeting: "Hello, {{name}} !",
      items_count: "You have {{count}} item | You have {{count}} items"
    }
  }
};

i18n
  .use(LanguageDetector) // Détecte automatiquement la langue du navigateur
  .use(initReactI18next) // Passe i18next à react-i18next
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut si la langue du navigateur n'est pas trouvée
    debug: false,
    interpolation: {
      escapeValue: false // React protège déjà des XSS
    }
  });

export default i18n;