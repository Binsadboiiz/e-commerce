import React, { createContext, useContext, useState } from 'react';
import vi from '@/locales/vi.json';
import en from '@/locales/en.json';

const LanguageContext = createContext();

const dictionary = { vi, en };

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('app_language') || 'vi';
  });

  const setLanguage = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key, params = {}) => {
    if (!key || typeof key !== 'string') return '';

    // Helper to safely extract string from translation dictionary
    const resolveString = (dict) => {
      if (!dict) return undefined;

      // 1. If key contains dot, perform nested object navigation e.g. "header.sellerCenter"
      if (key.includes('.')) {
        const keys = key.split('.');
        let current = dict;
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k];
          } else {
            return undefined;
          }
        }
        return typeof current === 'string' ? current : undefined;
      }

      // 2. Direct key lookup (ONLY accept string, ignore section objects)
      if (typeof dict[key] === 'string') {
        return dict[key];
      }

      // 3. Search in common namespaces if single key provided e.g. "cart", "sellerCenter"
      const namespaces = ['header', 'common', 'cart', 'auth', 'product', 'footer', 'home', 'profile', 'seller', 'admin'];
      for (const ns of namespaces) {
        if (dict[ns] && typeof dict[ns] === 'object' && typeof dict[ns][key] === 'string') {
          return dict[ns][key];
        }
      }

      return undefined;
    };

    let value = resolveString(dictionary[lang]);

    // Fallback to Vietnamese dictionary if current language misses it
    if (value === undefined && lang !== 'vi') {
      value = resolveString(dictionary['vi']);
    }

    // Fallback to key string itself if not found
    if (value === undefined) {
      value = key;
    }

    // String interpolation: e.g. {{percent}}, {{count}}
    if (typeof value === 'string' && params && Object.keys(params).length > 0) {
      Object.keys(params).forEach(pKey => {
        value = value.replace(new RegExp(`{{\\s*${pKey}\\s*}}`, 'g'), params[pKey]);
      });
    }

    // Strictly guarantee a string is returned (never an object or non-renderable React child)
    return typeof value === 'string' ? value : String(key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
