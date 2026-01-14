"use client";

import {
  ContentBackground,
  ContentImage,
  ContentLink,
  ContentText
} from "@/components/content";

export default function HomePage() {
  return (
    <main>
      <ContentBackground
        className="hero hero--home"
        contentKey="home.hero.background"
        defaultValue="/assets/images/hero-abstract.svg"
        cssVar="--hero-bg"
      >
        <div className="container hero-content hero-content--stack">
          <ContentImage
            className="hero-logo"
            contentKey="home.hero.logo"
            defaultSrc="/assets/images/logo.png"
            alt="Mila Bee Studios"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="home.hero.subtitle"
            defaultValue="Luxury. Creativity. Growth."
          />
          <div className="hero-actions">
            <ContentLink
              className="btn"
              contentKey="home.hero.cta.primary.href"
              defaultHref="/booking"
            >
              <ContentText
                as="span"
                contentKey="home.hero.cta.primary.label"
                defaultValue="Book Now"
              />
            </ContentLink>
            <ContentLink
              className="btn btn-secondary"
              contentKey="home.hero.cta.secondary.href"
              defaultHref="/join-our-team"
            >
              <ContentText
                as="span"
                contentKey="home.hero.cta.secondary.label"
                defaultValue="Join Our Team"
              />
            </ContentLink>
          </div>
        </div>
      </ContentBackground>

      <section className="section">
        <div className="container split">
          <div className="split-content">
            <ContentText
              as="p"
              className="section-kicker"
              contentKey="home.welcome.kicker"
              defaultValue="Welcome"
            />
            <ContentText
              as="h2"
              contentKey="home.welcome.title"
              defaultValue="Welcome to Mila Bee Studios"
            />
            <ContentText
              as="p"
              contentKey="home.welcome.body"
              defaultValue="Mila Bee Studios is a luxury beauty studio designed for licensed professionals who value professionalism, consistency, and long-term growth. Our studio provides a structured, high-standard environment where beauty professionals can focus on their craft while building sustainable careers."
            />
            <ContentLink
              className="btn btn-secondary"
              contentKey="home.welcome.cta.href"
              defaultHref="/our-story"
            >
              <ContentText
                as="span"
                contentKey="home.welcome.cta.label"
                defaultValue="Read our story"
              />
            </ContentLink>
          </div>
          <div className="split-media">
            <ContentImage
              contentKey="home.welcome.image"
              defaultSrc="/assets/images/studio-abstract-1.svg"
              alt="Mila Bee Studios interior"
            />
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="home.values.title"
            defaultValue="Our Mission & Values"
          />
          <ContentText
            as="p"
            className="lead"
            contentKey="home.values.lead"
            defaultValue="Our mission is to provide a luxury beauty environment that supports excellence, professionalism, and growth."
          />
          <div className="card-grid">
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.values.integrity.title"
                  defaultValue="Integrity"
                />
                <ContentText
                  as="p"
                  contentKey="home.values.integrity.body"
                  defaultValue="Integrity in all business practices."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.values.consistency.title"
                  defaultValue="Consistency"
                />
                <ContentText
                  as="p"
                  contentKey="home.values.consistency.body"
                  defaultValue="Consistency in service and professionalism."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.values.cleanliness.title"
                  defaultValue="Cleanliness"
                />
                <ContentText
                  as="p"
                  contentKey="home.values.cleanliness.body"
                  defaultValue="Cleanliness and safety at all times."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.values.respect.title"
                  defaultValue="Respect"
                />
                <ContentText
                  as="p"
                  contentKey="home.values.respect.body"
                  defaultValue="Respect for clients and colleagues."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.values.growth.title"
                  defaultValue="Growth"
                />
                <ContentText
                  as="p"
                  contentKey="home.values.growth.body"
                  defaultValue="Growth focused mindset."
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="home.work.title"
            defaultValue="Work Options"
          />
          <div className="card-grid">
            <article className="card">
              <ContentImage
                contentKey="home.work.commission.image"
                defaultSrc="/assets/images/studio-abstract-2.svg"
                alt="Commission based beauty artist"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.work.commission.title"
                  defaultValue="Commission-Based Beauty Artist"
                />
                <ContentText
                  as="p"
                  contentKey="home.work.commission.body"
                  defaultValue="Build your career with our support system."
                />
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="home.work.daily.image"
                defaultSrc="/assets/images/studio-abstract-3.svg"
                alt="Daily chair rental"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.work.daily.title"
                  defaultValue="Daily Chair Rental"
                />
                <ContentText
                  as="p"
                  contentKey="home.work.daily.body"
                  defaultValue="Flexible scheduling for part-time professionals."
                />
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="home.work.booth.image"
                defaultSrc="/assets/images/studio-abstract-4.svg"
                alt="Booth rental"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.work.booth.title"
                  defaultValue="Booth Rental"
                />
                <ContentText
                  as="p"
                  contentKey="home.work.booth.body"
                  defaultValue="Your dedicated space within our studio."
                />
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="home.work.suite.image"
                defaultSrc="/assets/images/studio-abstract-5.svg"
                alt="Private suite rental"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="home.work.suite.title"
                  defaultValue="Private Suite Rental"
                />
                <ContentText
                  as="p"
                  contentKey="home.work.suite.body"
                  defaultValue="Premium private workspace for established professionals."
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="home.rental.title"
            defaultValue="Rental Options & Rates"
          />
          <div className="stat-grid">
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="home.rental.daily.value"
                defaultValue="$55"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="home.rental.daily.label"
                defaultValue="Daily Chair Rental"
              />
              <ContentText
                as="p"
                className="stat-note"
                contentKey="home.rental.daily.note"
                defaultValue="Starts at $55 per day (max 2 days per week)."
              />
            </div>
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="home.rental.booth.value"
                defaultValue="$250"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="home.rental.booth.label"
                defaultValue="Booth Rental"
              />
              <ContentText
                as="p"
                className="stat-note"
                contentKey="home.rental.booth.note"
                defaultValue="Starts at $250 per week."
              />
            </div>
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="home.rental.suite.value"
                defaultValue="$285"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="home.rental.suite.label"
                defaultValue="Private Suite Rental"
              />
              <ContentText
                as="p"
                className="stat-note"
                contentKey="home.rental.suite.note"
                defaultValue="Starts at $285 per week, based on size and availability."
              />
            </div>
          </div>
          <ContentText
            as="p"
            className="small-note"
            contentKey="home.rental.note"
            defaultValue="Booth and Private Suite Rental earn 2 free weeks of rent per year (restrictions apply)."
          />
        </div>
      </section>

      <ContentBackground
        className="section section--image-bg"
        contentKey="home.culture.background"
        defaultValue="/assets/images/culture-abstract.svg"
        cssVar="--culture-bg"
      >
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="home.culture.title"
            defaultValue="Studio Culture & Expectations"
          />
          <ContentText
            as="p"
            contentKey="home.culture.body"
            defaultValue="Mila Bee Studios operates as a luxury studio, not a high-volume or hustle-based salon. We maintain clear expectations to protect the studio environment, our professionals, and our clients. Professionals are expected to arrive prepared, respect scheduling, maintain cleanliness, and uphold studio policies at all times."
          />
        </div>
      </ContentBackground>

      <ContentBackground
        className="section cta"
        contentKey="home.cta.background"
        defaultValue="/assets/images/cta-abstract.svg"
        cssVar="--cta-bg"
      >
        <div className="container cta-inner">
          <ContentText
            as="h2"
            contentKey="home.cta.title"
            defaultValue="Ready to grow with Mila Bee Studios?"
          />
          <ContentText
            as="p"
            className="lead"
            contentKey="home.cta.body"
            defaultValue="Join a luxury studio that values professionalism, creativity, and community."
          />
          <ContentLink
            className="btn"
            contentKey="home.cta.cta.href"
            defaultHref="/join-our-team"
          >
            <ContentText
              as="span"
              contentKey="home.cta.cta.label"
              defaultValue="Explore opportunities"
            />
          </ContentLink>
        </div>
      </ContentBackground>
    </main>
  );
}
