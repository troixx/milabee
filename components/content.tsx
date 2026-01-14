'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { supabase, SUPABASE_CONFIG_OK } from '@/lib/supabaseClient';

type ContentScope = 'global' | 'page';

type ContentContextValue = {
  getValue: (key: string, fallback: string, scope?: ContentScope) => string;
  ready: boolean;
  pageKey: string;
};

const ContentContext = createContext<ContentContextValue>({
  getValue: (_key, fallback) => fallback,
  ready: false,
  pageKey: 'home'
});

const PATH_TO_PAGE: Record<string, string> = {
  '/': 'home',
  '/our-story': 'our-story',
  '/booking': 'booking',
  '/policies': 'policies',
  '/faq': 'faq',
  '/stylists': 'stylists',
  '/stylist-profile': 'stylist-profile',
  '/join-our-team': 'join-our-team',
  '/contact': 'contact',
  '/store': 'store',
  '/login': 'login',
  '/admin': 'admin',
  '/bridal-inquiry': 'bridal-inquiry',
  '/classes': 'classes',
  '/commission-stylist': 'commission-stylist',
  '/model-academy': 'model-academy',
  '/salon-assistant-application': 'salon-assistant-application',
  '/suites': 'suites'
};

function normalizeAssetPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:') || lower.startsWith('blob:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  if (trimmed.startsWith('assets/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}

function normalizeHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  if (trimmed.startsWith('assets/')) {
    return `/${trimmed}`;
  }
  if (trimmed.endsWith('.html')) {
    const base = trimmed.replace(/\.html$/, '');
    if (base === 'index') {
      return '/';
    }
    return `/${base}`;
  }
  const cleaned = trimmed.startsWith('./') ? trimmed.slice(2) : trimmed;
  return `/${cleaned}`;
}

function resolvePageKey(pathname: string | null) {
  if (!pathname) {
    return 'home';
  }
  return PATH_TO_PAGE[pathname] || pathname.replace('/', '') || 'home';
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageKey = resolvePageKey(pathname);
  const [globalContent, setGlobalContent] = useState<Map<string, string>>(new Map());
  const [pageContent, setPageContent] = useState<Map<string, string>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isActive = true;
    setReady(false);

    if (!SUPABASE_CONFIG_OK) {
      setReady(true);
      return () => {
        isActive = false;
      };
    }

    supabase
      .from('site_content')
      .select('page, content_key, content_value')
      .in('page', ['global', pageKey])
      .then(({ data, error }) => {
        if (!isActive) {
          return;
        }

        if (error || !data) {
          setReady(true);
          return;
        }

        const nextGlobal = new Map<string, string>();
        const nextPage = new Map<string, string>();

        data.forEach((record) => {
          if (!record.content_key || record.content_value === null || record.content_value === undefined) {
            return;
          }
          if (record.page === 'global') {
            nextGlobal.set(record.content_key, record.content_value);
          } else {
            nextPage.set(record.content_key, record.content_value);
          }
        });

        setGlobalContent(nextGlobal);
        setPageContent(nextPage);
        setReady(true);
      });

    return () => {
      isActive = false;
    };
  }, [pageKey]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    document.dispatchEvent(new CustomEvent('content:loaded'));
  }, [ready, pageKey]);

  const getValue = useCallback(
    (key: string, fallback: string, scope: ContentScope = 'page') => {
      if (!key) {
        return fallback;
      }
      const value =
        scope === 'global'
          ? globalContent.get(key)
          : pageContent.get(key) ?? globalContent.get(key);
      if (value === undefined || value === null || value === '') {
        return fallback;
      }
      return value;
    },
    [globalContent, pageContent]
  );

  const contextValue = useMemo(
    () => ({
      getValue,
      ready,
      pageKey
    }),
    [getValue, ready, pageKey]
  );

  return <ContentContext.Provider value={contextValue}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

type ContentTextProps<T extends React.ElementType> = {
  as?: T;
  contentKey: string;
  defaultValue: string;
  scope?: ContentScope;
};

export function ContentText<T extends React.ElementType = 'span'>({
  as,
  contentKey,
  defaultValue,
  scope = 'page',
  ...rest
}: ContentTextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ContentTextProps<T>>) {
  const { getValue } = useContent();
  const Component = (as || 'span') as React.ElementType;
  const value = getValue(contentKey, defaultValue, scope);

  return (
    <Component
      data-content-key={contentKey}
      data-content-scope={scope === 'global' ? 'global' : undefined}
      {...rest}
    >
      {value}
    </Component>
  );
}

type ContentLinkProps = {
  contentKey: string;
  defaultHref: string;
  scope?: ContentScope;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
};

export function ContentLink({
  contentKey,
  defaultHref,
  scope = 'page',
  className,
  children,
  target,
  rel
}: ContentLinkProps) {
  const { getValue } = useContent();
  const href = normalizeHref(getValue(contentKey, defaultHref, scope));

  return (
    <a
      className={className}
      href={href}
      target={target}
      rel={rel}
      data-content-href-key={contentKey}
      data-content-scope={scope === 'global' ? 'global' : undefined}
    >
      {children}
    </a>
  );
}

type ContentImageProps = {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  scope?: ContentScope;
  className?: string;
};

export function ContentImage({
  contentKey,
  defaultSrc,
  alt,
  scope = 'page',
  className
}: ContentImageProps) {
  const { getValue } = useContent();
  const src = normalizeAssetPath(getValue(contentKey, defaultSrc, scope));

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      data-content-key={contentKey}
      data-content-target="src"
      data-content-scope={scope === 'global' ? 'global' : undefined}
    />
  );
}

type ContentBackgroundProps = {
  contentKey: string;
  defaultValue: string;
  cssVar: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function ContentBackground({
  contentKey,
  defaultValue,
  cssVar,
  className,
  children,
  style
}: ContentBackgroundProps) {
  const { getValue } = useContent();
  const value = normalizeAssetPath(getValue(contentKey, defaultValue, 'page'));
  const backgroundImage = value ? `url("${value}")` : undefined;

  return (
    <section
      className={className}
      data-content-key={contentKey}
      data-content-target="background"
      data-content-default={defaultValue}
      style={{ ...style, [cssVar]: backgroundImage } as React.CSSProperties}
    >
      {children}
    </section>
  );
}
