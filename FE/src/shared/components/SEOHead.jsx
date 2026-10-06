import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_SITE_NAME = 'E-Commerce Enterprise';
const DEFAULT_DESCRIPTION = 'Sàn thương mại điện tử uy tín hàng đầu - Mua sắm trực tuyến hàng chính hãng, giao hàng nhanh chóng, ưu đãi hấp dẫn mỗi ngày.';
const DEFAULT_KEYWORDS = 'e-commerce, mua sắm trực tuyến, hàng chính hãng, giảm giá, sản phẩm chất lượng';
const DEFAULT_OG_IMAGE = '/favicon.ico';

/**
 * Enterprise SEO Head Component
 * Dynamically manages document title, meta tags, OpenGraph, Twitter Cards, canonical link, and JSON-LD structured data.
 * 
 * @param {Object} props
 * @param {string} props.title - Page specific title
 * @param {string} [props.description] - Page meta description
 * @param {string} [props.keywords] - Page meta keywords
 * @param {string} [props.ogImage] - Social share image URL
 * @param {string} [props.canonicalUrl] - Canonical URL
 * @param {string} [props.robots] - Robots meta (default: 'index, follow')
 * @param {Object|Array} [props.jsonLd] - Structured Data JSON-LD object or array
 */
export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  robots = 'index, follow',
  jsonLd = null
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title (các title thay đổi theo page)
    const fullTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME;
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (name, content, attrName = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Helper to set or create link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Current page URL
    const currentUrl = canonicalUrl || `${window.location.origin}${location.pathname}`;

    // Standard Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('robots', robots);

    // OpenGraph Tags
    setMetaTag('og:title', fullTitle, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:type', 'website', 'property');
    setMetaTag('og:url', currentUrl, 'property');
    setMetaTag('og:image', ogImage, 'property');
    setMetaTag('og:site_name', DEFAULT_SITE_NAME, 'property');

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Canonical URL
    setLinkTag('canonical', currentUrl);

    // 4. JSON-LD Structured Data
    let scriptEl = document.getElementById('json-ld-schema');
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'json-ld-schema';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // Clean up title on unmount if needed
    return () => {
      // Intentionally keep title intact until next page mounts
    };
  }, [title, description, keywords, ogImage, canonicalUrl, robots, jsonLd, location.pathname]);

  return null;
}
