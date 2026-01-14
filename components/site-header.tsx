'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { ContentImage, ContentLink, ContentText } from './content';

const NAV_ITEMS = [
  {
    key: 'our-story',
    href: '/our-story',
    contentKey: 'global.nav.our-story.label',
    defaultLabel: 'Our Story'
  },
  {
    key: 'booking',
    href: '/booking',
    contentKey: 'global.nav.booking.label',
    defaultLabel: 'Booking'
  },
  {
    key: 'policies',
    href: '/policies',
    contentKey: 'global.nav.policies.label',
    defaultLabel: 'Policies'
  },
  {
    key: 'faq',
    href: '/faq',
    contentKey: 'global.nav.faq.label',
    defaultLabel: 'FAQ'
  },
  {
    key: 'stylists',
    href: '/stylists',
    contentKey: 'global.nav.stylists.label',
    defaultLabel: 'Stylists'
  },
  {
    key: 'join-our-team',
    href: '/join-our-team',
    contentKey: 'global.nav.join.label',
    defaultLabel: 'Join Our Team'
  },
  {
    key: 'contact',
    href: '/contact',
    contentKey: 'global.nav.contact.label',
    defaultLabel: 'Contact'
  },
  {
    key: 'store',
    href: '/store',
    contentKey: 'global.nav.store.label',
    defaultLabel: 'Store'
  },
  {
    key: 'login',
    href: '/login',
    contentKey: 'global.nav.login.label',
    defaultLabel: 'Store Login'
  }
];

function getActiveKey(pathname: string | null) {
  if (!pathname) {
    return '';
  }
  if (pathname === '/stylist-profile') {
    return 'stylists';
  }
  if (pathname === '/') {
    return 'home';
  }
  return pathname.replace('/', '');
}

export default function SiteHeader() {
  const pathname = usePathname();
  const activeKey = getActiveKey(pathname);
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-row">
        <a className="logo" href="/">
          <ContentImage
            contentKey="global.nav.logo-image"
            defaultSrc="/assets/images/logo.png"
            alt="Mila Bee Studios logo"
            scope="global"
          />
          <ContentText
            as="span"
            contentKey="global.nav.logo-text"
            defaultValue="Mila Bee Studios"
            scope="global"
          />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open ? 'true' : 'false'}
          aria-controls="site-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>
        <nav
          id="site-nav"
          className="site-nav"
          aria-label="Primary"
          data-open={open ? 'true' : 'false'}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              data-page-link={item.key}
              className={activeKey === item.key ? 'is-active' : undefined}
              aria-current={activeKey === item.key ? 'page' : undefined}
            >
              <ContentText
                as="span"
                contentKey={item.contentKey}
                defaultValue={item.defaultLabel}
                scope="global"
              />
            </a>
          ))}
          <ContentLink
            className="nav-cta"
            contentKey="global.nav.book.href"
            defaultHref="https://book.squareup.com/appointments/ybo95yta9iu845/location/LF318CTXFNTEK/services"
            scope="global"
            target="_blank"
            rel="noopener"
          >
            <ContentText
              as="span"
              contentKey="global.nav.book.label"
              defaultValue="Book Now"
              scope="global"
            />
          </ContentLink>
        </nav>
      </div>
    </header>
  );
}
