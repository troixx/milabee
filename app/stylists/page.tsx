"use client";

import { ContentImage, ContentLink, ContentText } from "@/components/content";

export default function StylistsPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="stylists.hero.title"
            defaultValue="Stylists"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="stylists.hero.subtitle"
            defaultValue="Profiles will be added as we hire stylists."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="p"
            className="lead"
            contentKey="stylists.lead"
            defaultValue="Check back soon for new stylist profiles. A profile template is available to preview the layout."
          />
          <div className="card-grid">
            <article className="card">
              <ContentImage
                contentKey="stylists.cards.template.image"
                defaultSrc="/assets/images/studio-abstract-7.svg"
                alt="Stylist profile template"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="stylists.cards.template.title"
                  defaultValue="Stylist Profile Template"
                />
                <ContentText
                  as="p"
                  contentKey="stylists.cards.template.body"
                  defaultValue="Preview the layout for future stylist profiles."
                />
                <ContentLink
                  className="btn btn-secondary"
                  contentKey="stylists.cards.template.cta.href"
                  defaultHref="/stylist-profile"
                >
                  <ContentText
                    as="span"
                    contentKey="stylists.cards.template.cta.label"
                    defaultValue="View template"
                  />
                </ContentLink>
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="stylists.cards.join.image"
                defaultSrc="/assets/images/studio-abstract-2.svg"
                alt="Join our team"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="stylists.cards.join.title"
                  defaultValue="Join our team"
                />
                <ContentText
                  as="p"
                  contentKey="stylists.cards.join.body"
                  defaultValue="Explore commission, rental, and private suite opportunities."
                />
                <ContentLink
                  className="btn btn-secondary"
                  contentKey="stylists.cards.join.cta.href"
                  defaultHref="/join-our-team"
                >
                  <ContentText
                    as="span"
                    contentKey="stylists.cards.join.cta.label"
                    defaultValue="View careers"
                  />
                </ContentLink>
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="stylists.cards.booking.image"
                defaultSrc="/assets/images/studio-abstract-3.svg"
                alt="Booking"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="stylists.cards.booking.title"
                  defaultValue="Book a chair"
                />
                <ContentText
                  as="p"
                  contentKey="stylists.cards.booking.body"
                  defaultValue="Daily chair rentals are available online."
                />
                <ContentLink
                  className="btn btn-secondary"
                  contentKey="stylists.cards.booking.cta.href"
                  defaultHref="/booking"
                >
                  <ContentText
                    as="span"
                    contentKey="stylists.cards.booking.cta.label"
                    defaultValue="Go to booking"
                  />
                </ContentLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
