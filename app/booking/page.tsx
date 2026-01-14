"use client";

import { ContentLink, ContentText } from "@/components/content";

const BOOKING_URL = "https://book.squareup.com/appointments/ybo95yta9iu845/location/LF318CTXFNTEK/services";
const GLOSS_GENIUS_URL = "https://milabeestudios.glossgenius.com/";

const HIGHLIGHT_FEATURES = [
  "Large mirrors, adjustable lighting, and premium styling stations.",
  "Complimentary refreshments plus fast fiber internet for content work.",
  "Flexible check-in/out times and concierge support from our front desk."
];

const GALLERY_IMAGES = [
  {
    src: "/assets/photos/a.jpeg",
    alt: "Bright studio suite with mirrors and seating",
    caption: "Primary suite with natural light and curated storage."
  },
  {
    src: "/assets/photos/b.jpeg",
    alt: "Mirror wall with metallic accents",
    caption: "Mirror wall and shelving for product displays."
  },
  {
    src: "/assets/photos/c.jpeg",
    alt: "Textured walls and plant life",
    caption: "Textured details and organic touches around the studio."
  },
  {
    src: "/assets/photos/d.jpeg",
    alt: "Soft lounge chairs and marble table",
    caption: "Cozy lounge for guests between services."
  },
  {
    src: "/assets/photos/e.jpeg",
    alt: "Light-filled workstation",
    caption: "Light-filled workstation ready for stylists to shine."
  },
  {
    src: "/assets/photos/f.jpeg",
    alt: "Stylists collaborating by styling chairs",
    caption: "Stylists collaborating inside the rentable suites."
  }
];

export default function BookingPage() {
  return (
    <main>
      <section className="hero hero--booking">
        <div className="container hero-content hero-content--stack">
          <ContentText
            as="p"
            className="section-kicker hero-kicker"
            contentKey="booking.hero.kicker"
            defaultValue="Signature chair rentals"
          />
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="booking.hero.title"
            defaultValue="Booking"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="booking.hero.subtitle"
            defaultValue="Reserve your daily chair rental online."
          />
          <div className="hero-actions">
            <ContentLink
              className="btn"
              contentKey="booking.hero.cta.gloss.href"
              defaultHref={GLOSS_GENIUS_URL}
              target="_blank"
              rel="noopener"
            >
              <ContentText
                as="span"
                contentKey="booking.hero.cta.gloss.label"
                defaultValue="Book at GlossGenius"
              />
            </ContentLink>
            <ContentLink
              className="btn btn-secondary"
              contentKey="booking.hero.cta.daily.href"
              defaultHref={BOOKING_URL}
              target="_blank"
              rel="noopener"
            >
              <ContentText
                as="span"
                contentKey="booking.hero.cta.daily.label"
                defaultValue="Daily chair rental"
              />
            </ContentLink>
          </div>
          <p className="small-note hero-policies">
            <ContentLink
              contentKey="booking.hero.cta.policies.href"
              defaultHref="/policies"
            >
              <ContentText
                as="span"
                contentKey="booking.hero.cta.policies.label"
                defaultValue="Studio policies"
              />
            </ContentLink>
          </p>
        </div>
      </section>

      <section className="section section--highlight">
        <div className="container">
          <div className="highlight-grid">
            <div className="highlight-media">
              <video controls poster="/assets/photos/a.jpeg" preload="none">
                <source src="/assets/photos/vid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <ContentText
                as="p"
                className="small-note"
                contentKey="booking.highlight.note"
                defaultValue="Studio walkthrough, lighting, and client experience highlights."
              />
            </div>
            <div className="highlight-text">
              <ContentText
                as="p"
                className="section-kicker"
                contentKey="booking.highlight.kicker"
                defaultValue="Immersive styling"
              />
              <ContentText
                as="h2"
                className="section-title"
                contentKey="booking.highlight.title"
                defaultValue="Reserve a day where creativity meets calm."
              />
              <ContentText
                as="p"
                className="lead"
                contentKey="booking.highlight.body"
                defaultValue="Our studio is tuned for stylists who crave curated finishes, natural light, and the freedom to make the chair their own for the day."
              />
              <ul className="feature-list highlight-list">
                {HIGHLIGHT_FEATURES.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <ContentLink
                className="btn btn-secondary"
                contentKey="booking.highlight.cta.href"
                defaultHref="/contact"
              >
                <ContentText
                  as="span"
                  contentKey="booking.highlight.cta.label"
                  defaultValue="Coordinate a walkthrough"
                />
              </ContentLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--gallery">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Studio gallery</p>
            <ContentText
              as="h2"
              className="section-title"
              contentKey="booking.gallery.title"
              defaultValue="A glimpse inside Mila Bee Studios"
            />
            <ContentText
              as="p"
              className="lead"
              contentKey="booking.gallery.body"
              defaultValue="Every rental day is styled with luxe touches so your clients feel pampered before the first snip."
            />
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((image) => (
              <figure className="gallery-card" key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--book">
        <div className="container">
          <ContentText
            as="h2"
            contentKey="booking.section.title"
            defaultValue="Book your space"
          />
          <ContentText
            as="p"
            className="lead"
            contentKey="booking.section.lead"
            defaultValue="Use the embedded booking widget below or follow the fallback link to secure your daily chair rental."
          />
          <div className="booking-embed">
            <iframe
              src={BOOKING_URL}
              title="Mila Bee Studios booking"
              loading="lazy"
            ></iframe>
            <div className="booking-fallback">
              <ContentText
                as="p"
                className="small-note"
                contentKey="booking.section.embed-note"
                defaultValue="If the booking widget does not load, use the button to open it in a new tab."
              />
              <ContentLink
                className="btn btn-secondary"
                contentKey="booking.section.cta.href"
                defaultHref={BOOKING_URL}
                target="_blank"
                rel="noopener"
              >
                <ContentText
                  as="span"
                  contentKey="booking.section.cta.label"
                  defaultValue="Book Daily Chair Rental"
                />
              </ContentLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
