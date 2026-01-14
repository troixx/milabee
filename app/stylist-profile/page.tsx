"use client";

import { ContentImage, ContentLink, ContentText } from "@/components/content";

export default function StylistProfilePage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="stylist-profile.hero.title"
            defaultValue="Stylist Profile"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="stylist-profile.hero.subtitle"
            defaultValue="Template for future stylist profiles."
          />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-media">
            <ContentImage
              contentKey="stylist-profile.image"
              defaultSrc="/assets/images/studio-abstract-7.svg"
              alt="Stylist portrait placeholder"
            />
          </div>
          <div className="split-content">
            <ContentText
              as="p"
              className="section-kicker"
              contentKey="stylist-profile.kicker"
              defaultValue="Profile"
            />
            <ContentText
              as="h2"
              contentKey="stylist-profile.name"
              defaultValue="Stylist Name"
            />
            <ContentText
              as="p"
              className="lead"
              contentKey="stylist-profile.bio"
              defaultValue="Short bio placeholder. Highlight experience, specialties, and the vibe clients can expect."
            />
            <ContentText
              as="h3"
              contentKey="stylist-profile.specialties.title"
              defaultValue="Specialties"
            />
            <ul className="feature-list">
              <ContentText
                as="li"
                contentKey="stylist-profile.specialties.item1"
                defaultValue="Signature services"
              />
              <ContentText
                as="li"
                contentKey="stylist-profile.specialties.item2"
                defaultValue="Healthy hair care"
              />
              <ContentText
                as="li"
                contentKey="stylist-profile.specialties.item3"
                defaultValue="Custom color"
              />
            </ul>
            <div className="hero-actions">
              <ContentLink
                className="btn"
                contentKey="stylist-profile.cta.primary.href"
                defaultHref="/booking"
              >
                <ContentText
                  as="span"
                  contentKey="stylist-profile.cta.primary.label"
                  defaultValue="Book with this stylist"
                />
              </ContentLink>
              <ContentLink
                className="btn btn-secondary"
                contentKey="stylist-profile.cta.secondary.href"
                defaultHref="https://linktr.ee/milabeestudios"
                target="_blank"
                rel="noopener"
              >
                <ContentText
                  as="span"
                  contentKey="stylist-profile.cta.secondary.label"
                  defaultValue="View portfolio"
                />
              </ContentLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
