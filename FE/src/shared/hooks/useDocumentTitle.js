import { useEffect } from 'react';

const DEFAULT_SITE_NAME = 'E-Commerce Enterprise';

/**
 * Custom Hook to set dynamic page title & meta description
 * 
 * @param {string} title - Dynamic page title
 * @param {string} [description] - Optional page description
 */
export function useDocumentTitle(title, description = '') {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME;
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }, [title, description]);
}

export default useDocumentTitle;
