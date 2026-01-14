'use client';

import { ContentLink, ContentText } from './content';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-card">
          <ContentText
            as="h2"
            contentKey="global.footer.title"
            defaultValue="Mila Bee Studios"
            scope="global"
          />
          <ContentText
            as="p"
            contentKey="global.footer.tagline"
            defaultValue="Luxury. Creativity. Growth."
            scope="global"
          />
          <p>
            <ContentText
              as="span"
              contentKey="global.footer.email.label"
              defaultValue="Email us at "
              scope="global"
            />
            <ContentLink
              contentKey="global.footer.email.href"
              defaultHref="mailto:milabeestudios@gmail.com"
              scope="global"
            >
              <ContentText
                as="span"
                contentKey="global.footer.email.address"
                defaultValue="milabeestudios@gmail.com"
                scope="global"
              />
            </ContentLink>
            .
          </p>
          <div className="footer-actions">
            <ContentLink
              className="btn btn-secondary"
              contentKey="global.footer.linktree.href"
              defaultHref="https://linktr.ee/milabeestudios"
              scope="global"
              target="_blank"
              rel="noopener"
            >
              <ContentText
                as="span"
                contentKey="global.footer.linktree.label"
                defaultValue="Visit our Linktree"
                scope="global"
              />
            </ContentLink>
          </div>
        </div>
        <div className="footer-links">
          <ContentText
            as="h3"
            contentKey="global.footer.explore.title"
            defaultValue="Explore"
            scope="global"
          />
          <ContentText
            as="a"
            href="/our-story"
            contentKey="global.footer.explore.our-story.label"
            defaultValue="Our Story"
            scope="global"
          />
          <ContentText
            as="a"
            href="/booking"
            contentKey="global.footer.explore.booking.label"
            defaultValue="Booking"
            scope="global"
          />
          <ContentText
            as="a"
            href="/policies"
            contentKey="global.footer.explore.policies.label"
            defaultValue="Policies"
            scope="global"
          />
          <ContentText
            as="a"
            href="/faq"
            contentKey="global.footer.explore.faq.label"
            defaultValue="FAQ"
            scope="global"
          />
          <ContentText
            as="a"
            href="/stylists"
            contentKey="global.footer.explore.stylists.label"
            defaultValue="Stylists"
            scope="global"
          />
          <ContentText
            as="a"
            href="/join-our-team"
            contentKey="global.footer.explore.join.label"
            defaultValue="Join Our Team"
            scope="global"
          />
          <ContentText
            as="a"
            href="/contact"
            contentKey="global.footer.explore.contact.label"
            defaultValue="Contact"
            scope="global"
          />
          <ContentText
            as="a"
            href="/store"
            contentKey="global.footer.explore.store.label"
            defaultValue="Store"
            scope="global"
          />
          <ContentText
            as="a"
            href="/login"
            contentKey="global.footer.explore.login.label"
            defaultValue="Store Login"
            scope="global"
          />
          <ContentLink
            contentKey="global.footer.explore.book.href"
            defaultHref="https://book.squareup.com/appointments/ybo95yta9iu845/location/LF318CTXFNTEK/services"
            scope="global"
            target="_blank"
            rel="noopener"
          >
            <ContentText
              as="span"
              contentKey="global.footer.explore.book.label"
              defaultValue="Book Daily Chair Rental"
              scope="global"
            />
          </ContentLink>
        </div>
      </div>
      <div className="container footer-bottom">
        <ContentText
          as="span"
          contentKey="global.footer.bottom.left"
          defaultValue="Mila Bee Studios"
          scope="global"
        />
        <ContentText
          as="span"
          contentKey="global.footer.bottom.right"
          defaultValue="milabeestudios.com"
          scope="global"
        />
      </div>
    </footer>
  );
}
