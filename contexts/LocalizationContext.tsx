
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'de' | 'es';
type Translations = Record<string, string>;
type AllTranslations = Record<Language, Translations>;

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, interpolations?: Record<string, string | number | undefined>, defaultValue?: string) => string;
  getLanguageName: (langCode: Language) => string;
  translationsLoaded: boolean;
}

// Default empty translations
const defaultTranslations: AllTranslations = {
  en: {},
  fr: {},
  de: {},
  es: {},
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLang = localStorage.getItem('appLanguage') as Language;
      // Check if storedLang is a valid key in our potential translations
      if (storedLang && ['en', 'fr', 'de', 'es'].includes(storedLang)) {
        return storedLang;
      }
      const browserLang = navigator.language.split('-')[0] as Language;
      return ['en', 'fr', 'de', 'es'].includes(browserLang) ? browserLang : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const [loadedTranslations, setLoadedTranslations] = useState<AllTranslations>(defaultTranslations);
  const [translationsLoaded, setTranslationsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const langFiles: Language[] = ['en', 'fr', 'de', 'es'];
        const responses = await Promise.all(
          langFiles.map(lang => fetch(`./locales/${lang}.json`)) // Paths relative to index.html
        );

        const jsonData = await Promise.all(responses.map(res => {
          if (!res.ok) {
            console.error(`Failed to load translation file: ${res.url}, status: ${res.status}`);
            return {}; // Return empty object for this language on error
          }
          return res.json();
        }));
        
        const newTranslations: AllTranslations = { en: {}, fr: {}, de: {}, es: {} };
        langFiles.forEach((lang, index) => {
          newTranslations[lang] = jsonData[index] || {};
        });
        
        setLoadedTranslations(newTranslations);
        setTranslationsLoaded(true);
      } catch (error) {
        console.error("Error loading translation files:", error);
        // Fallback: Use empty translations or only English if it was hardcoded/embedded
        setLoadedTranslations(prev => ({...prev, en: prev.en || {}})); // Ensure 'en' at least exists
        setTranslationsLoaded(true); // Still set to true to allow app to render, albeit with missing translations
      }
    };

    fetchTranslations();
  }, []);


  useEffect(() => {
    if (translationsLoaded) { // Only update localStorage and HTML lang if translations (and thus initial lang) are resolved
        try {
            localStorage.setItem('appLanguage', language);
            document.documentElement.lang = language;
        } catch (e) {
            console.warn('Failed to save language to localStorage');
        }
    }
  }, [language, translationsLoaded]);

  const setLanguage = useCallback((lang: Language) => {
    if (['en', 'fr', 'de', 'es'].includes(lang)) {
      setLanguageState(lang);
    } else {
      console.warn(`Language ${lang} not supported, defaulting to English.`);
      setLanguageState('en');
    }
  }, []);

  const t = useCallback((key: string, interpolations?: Record<string, string | number | undefined>, defaultValue?: string): string => {
    if (!translationsLoaded && !defaultValue) {
        // console.warn(`Translations not loaded, returning key: ${key}`);
        return key; // Or some loading indicator string like "..."
    }
    let translation = loadedTranslations[language]?.[key] || loadedTranslations['en']?.[key] || defaultValue || key;
    if (interpolations) {
      Object.entries(interpolations).forEach(([varName, value]) => {
        if (value !== undefined) {
          translation = translation.replace(new RegExp(`{${varName}}`, 'g'), String(value));
        }
      });
    }
    return translation;
  }, [language, loadedTranslations, translationsLoaded]);

  const getLanguageName = useCallback((langCode: Language): string => {
      switch(langCode) {
          case 'en': return t('language.en', {}, 'English');
          case 'fr': return t('language.fr', {}, 'Français');
          case 'de': return t('language.de', {}, 'Deutsch');
          case 'es': return t('language.es', {}, 'Español');
          default: return langCode;
      }
  }, [t]);


  if (!translationsLoaded) {
    // Optionally render a loading state for the whole app, or let individual components handle it.
    // For simplicity, we'll render children once initial load attempt is done (success or fail).
    // A more robust app might show a global loading spinner.
    return null; // Or <div className="app-loading">Loading translations...</div>;
  }

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, getLanguageName, translationsLoaded }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
