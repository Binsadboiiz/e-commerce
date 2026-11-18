/**
 * Canonical URL Generator & Sanitizer Utility
 * Filters out tracking query parameters (UTM, fbclid, gclid, etc.)
 * to ensure search engine crawlers index clean, non-duplicate URLs.
 */

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'msclkid',
  'ref',
  'source',
  'spm',
  '_ga',
  '_gl',
  'session_id',
  'affiliate_id'
]);

/**
 * Builds a clean canonical URL by removing tracking query parameters
 * and standardizing trailing slashes.
 * 
 * @param {string} rawUrl - Full original URL or window.location href
 * @param {string} [overrideCanonical] - Explicit canonical URL provided by page component
 * @returns {string} Standardized Canonical URL
 */
export function buildCanonicalUrl(rawUrl, overrideCanonical = null) {
  if (overrideCanonical) {
    return overrideCanonical;
  }

  if (!rawUrl) return '';

  try {
    const urlObj = new URL(rawUrl, window.location.origin);

    // Filter out tracking query parameters
    const searchParams = new URLSearchParams(urlObj.search);
    Array.from(searchParams.keys()).forEach(key => {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        searchParams.delete(key);
      }
    });

    // Normalize Pathname (remove trailing slash except for root path)
    let cleanPath = urlObj.pathname;
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }

    const searchString = searchParams.toString();
    const finalSearch = searchString ? `?${searchString}` : '';

    return `${urlObj.origin}${cleanPath}${finalSearch}`;
  } catch (error) {
    console.warn('[Canonical Engine] Error parsing URL:', rawUrl, error);
    return rawUrl;
  }
}
