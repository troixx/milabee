"use client";

import { ContentImage, ContentLink, ContentText } from "@/components/content";

export default function ContactPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="contact.hero.title"
            defaultValue="Contact Us"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="h2"
            contentKey="contact.section.title"
            defaultValue="Get in touch"
          />
          <ContentText
            as="p"
            contentKey="contact.section.body1"
            defaultValue="For all inquiries, please contact us via email:"
          />
          <p>
            <ContentLink
              className="btn btn-secondary"
              contentKey="contact.section.email.href"
              defaultHref="mailto:milabeestudios@gmail.com"
            >
              <ContentText
                as="span"
                contentKey="contact.section.email.label"
                defaultValue="milabeestudios@gmail.com"
              />
            </ContentLink>
          </p>
          <ContentText
            as="p"
            contentKey="contact.section.body2"
            defaultValue="We respond to emails as quickly as possible during business hours."
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="card-grid">
            <article className="card">
              <ContentImage
                contentKey="contact.cards.linktree.image"
                defaultSrc="/assets/images/studio-abstract-6.svg"
                alt="Mila Bee Studios contact"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="contact.cards.linktree.title"
                  defaultValue="Linktree"
                />
                <ContentText
                  as="p"
                  contentKey="contact.cards.linktree.body"
                  defaultValue="View our latest updates, links, and social channels."
                />
                <ContentLink
                  className="btn btn-secondary"
                  contentKey="contact.cards.linktree.cta.href"
                  defaultHref="https://linktr.ee/milabeestudios"
                  target="_blank"
                  rel="noopener"
                >
                  <ContentText
                    as="span"
                    contentKey="contact.cards.linktree.cta.label"
                    defaultValue="Visit Linktree"
                  />
                </ContentLink>
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="contact.cards.booking.image"
                defaultSrc="/assets/images/studio-abstract-6.svg"
                alt="Booking"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="contact.cards.booking.title"
                  defaultValue="Book an appointment"
                />
                <ContentText
                  as="p"
                  contentKey="contact.cards.booking.body"
                  defaultValue="Daily chair rental and appointments are available online."
                />
                <ContentLink
                  className="btn btn-secondary"
                  contentKey="contact.cards.booking.cta.href"
                  defaultHref="https://book.squareup.com/appointments/ybo95yta9iu845/location/LF318CTXFNTEK/services"
                  target="_blank"
                  rel="noopener"
                >
                  <ContentText
                    as="span"
                    contentKey="contact.cards.booking.cta.label"
                    defaultValue="Book now"
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
