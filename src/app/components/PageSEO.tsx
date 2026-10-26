import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '../data/site';

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function PageSEO({ title, description, path = '', noIndex = false }: PageSEOProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    upsertMeta('description', description);
    upsertMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('og:title', fullTitle, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:locale', 'es_AR', 'property');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', fullTitle);
    upsertMeta('twitter:description', description);

    const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    upsertLink('canonical', canonicalUrl);
    upsertMeta('og:url', canonicalUrl, 'property');
  }, [title, description, path, noIndex]);

  return null;
}
