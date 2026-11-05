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
      action_confirm:"Confirmation de l'action",
      action_confirm_message:"Vous êtes sur le point d'exécuter l'action sélectionnée. Souhaitez-vous poursuivre ?",
      create_btn:"Créer",
      delete_btn:"Supprimer",
      cancel_btn:"Annuler",
      update_btn:"Modifier",
      save_btn:'Enregistrer',
      apply_btn:"Appliquer",
      filesize_warning:"Fichier trop lourd",
      filesize_warning_message:"La taille de l'image ne doit pas dépasser",
      login_error: "Identifiants ou Mot de passe incorrects.",
      connexion_fail:"Échec de la connexion",
      user:"Utilisateur",
      password:"Mot de passe",
      change_passord:"Changer le mot de passe",
      forget_password:"Mot de passe oublié ?",
      duplicate_key:"Clé primaire déjà utilisée",
      duplicate_key_message:"La valeur renseignée pour la clé primaire est déjà associée à un enregistrement existant. Veuillez utiliser une valeur différente.",
      language: "Langue :",
      logout: "Se déconnecter",
      like_lb: "Contient",
      is_null_lb: "Est Null",
      is_not_null_lb: "N'est pas null",
      filter_name:"Nom du filtre",
      filter_cond: "Conditions (Correspond à TOUTES les règles)",
      add_filter:"Ajouter une condition",
      no_filter_message:"Aucun filtre enregistré",
      create_filter_btn:"Créer un filtre personnalisé",
      registred_filter:"Filtres enregistrés",
      placeholder_lb:"Sélectionner...",
      searchPlaceholder_lb:"Rechercher...",
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