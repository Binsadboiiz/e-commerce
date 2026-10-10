import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildCanonicalUrl } from '../utils/canonicalHelper';

const DEFAULT_SITE_NAME = 'PolarisX Mall';
const DEFAULT_DESCRIPTION = 'Sàn thương mại điện tử uy tín hàng đầu - Mua sắm trực tuyến hàng chính hãng, giao hàng nhanh chóng, ưu đãi hấp dẫn mỗi ngày.';
const DEFAULT_KEYWORDS = 'e-commerce, mua sắm trực tuyến, hàng chính hãng, giảm giá, sản phẩm chất lượng';
const DEFAULT_OG_IMAGE = '/logo.png';

/**
 * Enterprise SEO Head Component with Prerender.io Support
 * Dynamically manages document title, meta tags, OpenGraph, Twitter Cards, canonical link, 
 * HTTP status codes for crawlers, window.prerenderReady signal, and JSON-LD structured data.
 * 
 * @param {Object} props
 * @param {string} props.title - Page specific title
 * @param {string} [props.description] - Page meta description
 * @param {string} [props.keywords] - Page meta keywords
 * @param {string} [props.ogImage] - Social share image URL
 * @param {string} [props.canonicalUrl] - Canonical URL
 * @param {string} [props.robots] - Robots meta (default: 'index, follow')
 * @param {Object|Array} [props.jsonLd] - Structured Data JSON-LD object or array
 * @param {number} [props.statusCode] - Prerender HTTP Status Code (default: 200)
 * @param {boolean} [props.isReady] - Prerender readiness signal (default: true)
 * @param {string} [props.redirectUrl] - Prerender header location redirect URL
 */
export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  robots = 'index, follow',
  jsonLd = null,
  statusCode = 200,
  isReady = true,
  redirectUrl = null
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Manage Prerender.io Readiness Flag
    window.prerenderReady = isReady;

    // 2. Update Document Title
    const fullTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME;
    document.title = fullTitle;

    // 3. Helper to set or create meta tag
    const setMetaTag = (name, content, attrName = 'name') => {
      if (content === undefined || content === null) {
        const existing = document.querySelector(`meta[${attrName}="${name}"]`);
        if (existing) existing.remove();
        return;
      }
      let el = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', String(content));
    };

    // 4. Helper to set or create link tag
    const setLinkTag = (rel, href) => {
      if (!href) {
        const existing = document.querySelector(`link[rel="${rel}"]`);
        if (existing) existing.remove();
        return;
      }
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Compute Clean Canonical URL (strips tracking params like utm_*, fbclid, etc.)
    const rawUrl = `${window.location.origin}${location.pathname}${location.search}`;
    const cleanCanonicalUrl = buildCanonicalUrl(rawUrl, canonicalUrl);

    // Standard Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('robots', robots);

    // Prerender.io Control Tags
    if (statusCode && statusCode !== 200) {
      setMetaTag('prerender-status-code', statusCode);
    } else {
      setMetaTag('prerender-status-code', null);
    }

    if (redirectUrl) {
      setMetaTag('prerender-header', `Location: ${redirectUrl}`);
    } else {
      setMetaTag('prerender-header', null);
    }

    // OpenGraph Tags
    const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
    setMetaTag('og:title', fullTitle, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:type', 'website', 'property');
    setMetaTag('og:url', cleanCanonicalUrl, 'property');
    setMetaTag('og:image', fullOgImage, 'property');
    setMetaTag('og:site_name', DEFAULT_SITE_NAME, 'property');

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', fullOgImage);

    // Canonical URL
    setLinkTag('canonical', cleanCanonicalUrl);

    // 5. JSON-LD Structured Data
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
  }, [title, description, keywords, ogImage, canonicalUrl, robots, jsonLd, statusCode, isReady, redirectUrl, location.pathname, location.search]);

  return null;
}

