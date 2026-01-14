import { supabase, SUPABASE_CONFIG_OK } from './supabase-client.js';

const pageKey = document.body?.dataset?.contentPage || document.body?.dataset?.page;

function inferTarget(element) {
  if (!element) {
    return 'text';
  }
  const tag = element.tagName ? element.tagName.toLowerCase() : '';
  if (tag === 'img') {
    return 'src';
  }
  if (tag === 'meta') {
    return 'meta';
  }
  return 'text';
}

function applyValue(element, value, target) {
  if (!element) {
    return;
  }

  switch (target) {
    case 'src':
      element.setAttribute('src', value);
      break;
    case 'href':
      element.setAttribute('href', value);
      break;
    case 'background':
      element.style.backgroundImage = `url("${value}")`;
      break;
    case 'meta':
      element.setAttribute('content', value);
      break;
    case 'data':
      element.setAttribute('data', value);
      break;
    case 'value':
      element.value = value;
      break;
    case 'text':
    default:
      element.textContent = value;
      break;
  }
}

function applyRecord(record) {
  if (!record || !record.content_key) {
    return;
  }

  const key = record.content_key;
  const value = record.content_value;
  if (value === null || value === undefined) {
    return;
  }

  const scopeSelector = record.page === 'global' ? '[data-content-scope="global"]' : '';
  const keySelector = scopeSelector
    ? `${scopeSelector}[data-content-key="${key}"]`
    : `[data-content-key="${key}"]`;
  document.querySelectorAll(keySelector).forEach((element) => {
    const target = element.dataset.contentTarget || inferTarget(element);
    applyValue(element, value, target);
  });

  const hrefSelector = scopeSelector
    ? `${scopeSelector}[data-content-href-key="${key}"]`
    : `[data-content-href-key="${key}"]`;
  document.querySelectorAll(hrefSelector).forEach((element) => {
    element.setAttribute('href', value);
  });
}

async function loadContent() {
  if (!SUPABASE_CONFIG_OK || !pageKey) {
    document.dispatchEvent(new CustomEvent('content:loaded'));
    return;
  }

  const { data, error } = await supabase
    .from('site_content')
    .select('page, content_key, content_value, content_type')
    .in('page', ['global', pageKey]);

  if (error) {
    console.warn('Unable to load content', error.message);
    document.dispatchEvent(new CustomEvent('content:loaded'));
    return;
  }

  (data || []).forEach((record) => {
    applyRecord(record);
  });

  document.dispatchEvent(new CustomEvent('content:loaded'));
}

loadContent();
