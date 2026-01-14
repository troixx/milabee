"use client";

import { ContentImage, ContentLink, ContentText } from "@/components/content";

export default function JoinOurTeamPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="join.hero.title"
            defaultValue="Join Our Team"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="join.hero.subtitle"
            defaultValue="Careers & Salon Opportunities"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="p"
            className="section-kicker"
            contentKey="join.careers.kicker"
            defaultValue="Careers"
          />
          <ContentText
            as="h2"
            contentKey="join.careers.title"
            defaultValue="Interested in joining Mila Bee Studios?"
          />
          <ContentText
            as="p"
            className="lead"
            contentKey="join.careers.lead"
            defaultValue="Click our Hiring Packet to learn more about how to apply. We offer multiple opportunities to fit your business goals."
          />
          <ul className="feature-list">
            <ContentText
              as="li"
              contentKey="join.careers.item1"
              defaultValue="Daily Rental"
            />
            <ContentText
              as="li"
              contentKey="join.careers.item2"
              defaultValue="Booth Rental"
            />
            <ContentText
              as="li"
              contentKey="join.careers.item3"
              defaultValue="Private Suites"
            />
            <ContentText
              as="li"
              contentKey="join.careers.item4"
              defaultValue="Commission-Based Positions"
            />
          </ul>
          <div className="hero-actions">
            <ContentLink
              className="btn"
              contentKey="join.careers.packet.href"
              defaultHref="/assets/docs/mila-bee-studios-hiring-packet.pdf"
              target="_blank"
              rel="noopener"
            >
              <ContentText
                as="span"
                contentKey="join.careers.packet.label"
                defaultValue="Download Hiring Packet (PDF)"
              />
            </ContentLink>
            <ContentLink
              className="btn btn-secondary"
              contentKey="join.careers.email.href"
              defaultHref="mailto:milabeestudios@gmail.com"
            >
              <ContentText
                as="span"
                contentKey="join.careers.email.label"
                defaultValue="Email us"
              />
            </ContentLink>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.packet.title"
            defaultValue="Hiring Packet"
          />
          <div className="pdf-embed">
            <object
              data="/assets/docs/mila-bee-studios-hiring-packet.pdf"
              type="application/pdf"
              data-content-key="join.packet.pdf"
              data-content-target="data"
            >
              <p>
                <ContentText
                  as="span"
                  contentKey="join.packet.fallback.text"
                  defaultValue="PDF preview is not available."
                />{" "}
                <ContentLink
                  contentKey="join.packet.fallback.link.href"
                  defaultHref="/assets/docs/mila-bee-studios-hiring-packet.pdf"
                >
                  <ContentText
                    as="span"
                    contentKey="join.packet.fallback.link.label"
                    defaultValue="Download the Hiring Packet"
                  />
                </ContentLink>
                .
              </p>
            </object>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.welcome.title"
            defaultValue="Welcome to Mila Bee Studios"
          />
          <ContentText
            as="p"
            contentKey="join.welcome.body"
            defaultValue="Mila Bee Studios is a luxury beauty studio designed for licensed professionals who value professionalism, consistency, and long-term growth. Our studio provides a structured, high-standard environment where beauty professionals can focus on their craft while building sustainable careers."
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.values.title"
            defaultValue="Our Mission & Values"
          />
          <ContentText
            as="p"
            className="lead"
            contentKey="join.values.lead"
            defaultValue="Our mission is to provide a luxury beauty environment that supports excellence, professionalism, and growth."
          />
          <div className="card-grid">
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.values.integrity.title"
                  defaultValue="Integrity"
                />
                <ContentText
                  as="p"
                  contentKey="join.values.integrity.body"
                  defaultValue="Integrity in all business practices."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.values.consistency.title"
                  defaultValue="Consistency"
                />
                <ContentText
                  as="p"
                  contentKey="join.values.consistency.body"
                  defaultValue="Consistency in service and professionalism."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.values.cleanliness.title"
                  defaultValue="Cleanliness"
                />
                <ContentText
                  as="p"
                  contentKey="join.values.cleanliness.body"
                  defaultValue="Cleanliness and safety at all times."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.values.respect.title"
                  defaultValue="Respect"
                />
                <ContentText
                  as="p"
                  contentKey="join.values.respect.body"
                  defaultValue="Respect for clients and colleagues."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.values.growth.title"
                  defaultValue="Growth"
                />
                <ContentText
                  as="p"
                  contentKey="join.values.growth.body"
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
            contentKey="join.culture.title"
            defaultValue="Studio Culture & Expectations"
          />
          <ContentText
            as="p"
            contentKey="join.culture.body"
            defaultValue="Mila Bee Studios operates as a luxury studio, not a high-volume or hustle-based salon. We maintain clear expectations to protect the studio environment, our professionals, and our clients. Professionals are expected to arrive prepared, respect scheduling, maintain cleanliness, and uphold studio policies at all times."
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.work.title"
            defaultValue="Work Options"
          />
          <div className="card-grid">
            <article className="card">
              <ContentImage
                contentKey="join.work.commission.image"
                defaultSrc="/assets/images/studio-abstract-2.svg"
                alt="Commission based beauty artist"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.work.commission.title"
                  defaultValue="Commission-Based Beauty Artist"
                />
                <ContentText
                  as="p"
                  contentKey="join.work.commission.body"
                  defaultValue="Build your career with our support system."
                />
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="join.work.daily.image"
                defaultSrc="/assets/images/studio-abstract-3.svg"
                alt="Daily chair rental"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.work.daily.title"
                  defaultValue="Daily Chair Rental"
                />
                <ContentText
                  as="p"
                  contentKey="join.work.daily.body"
                  defaultValue="Flexible scheduling for part-time professionals."
                />
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="join.work.booth.image"
                defaultSrc="/assets/images/studio-abstract-4.svg"
                alt="Booth rental"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.work.booth.title"
                  defaultValue="Booth Rental"
                />
                <ContentText
                  as="p"
                  contentKey="join.work.booth.body"
                  defaultValue="Your dedicated space within our studio."
                />
              </div>
            </article>
            <article className="card">
              <ContentImage
                contentKey="join.work.suite.image"
                defaultSrc="/assets/images/studio-abstract-5.svg"
                alt="Private suite rental"
              />
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.work.suite.title"
                  defaultValue="Private Suite Rental"
                />
                <ContentText
                  as="p"
                  contentKey="join.work.suite.body"
                  defaultValue="Premium private workspace for established professionals."
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
            contentKey="join.commission.title"
            defaultValue="Commission Structure"
          />
          <div className="stat-grid">
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="join.commission.item1.value"
                defaultValue="40%"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="join.commission.item1.label"
                defaultValue="Assistant / Junior Beauty Artist"
              />
            </div>
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="join.commission.item2.value"
                defaultValue="50%"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="join.commission.item2.label"
                defaultValue="Luxury Beauty Artist"
              />
            </div>
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="join.commission.item3.value"
                defaultValue="60%"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="join.commission.item3.label"
                defaultValue="Senior Beauty Artist"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.bonus.title"
            defaultValue="Bonus & Incentive Plan"
          />
          <ContentText
            as="p"
            className="small-note"
            contentKey="join.bonus.note"
            defaultValue="Bonuses are designed to reward performance, professionalism, and consistency. Bonuses are reviewed monthly and are not guaranteed."
          />
          <ul className="feature-list">
            <ContentText
              as="li"
              contentKey="join.bonus.item1"
              defaultValue="Service Revenue Bonus: $100 to $300 based on monthly totals."
            />
            <ContentText
              as="li"
              contentKey="join.bonus.item2"
              defaultValue="Client Retention Bonus: $50 for 80 percent or higher rebooking rate."
            />
            <ContentText
              as="li"
              contentKey="join.bonus.item3"
              defaultValue="Retail and Add-On Bonus: 10 percent of monthly sales."
            />
            <ContentText
              as="li"
              contentKey="join.bonus.item4"
              defaultValue="Referral Bonus: $150 per stylist after 60 days."
            />
            <ContentText
              as="li"
              contentKey="join.bonus.item5"
              defaultValue="Consistency Bonus: $50 for policy compliance and punctuality (90 days)."
            />
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.rental.title"
            defaultValue="Rental Options & Rates"
          />
          <div className="stat-grid">
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="join.rental.daily.value"
                defaultValue="$55"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="join.rental.daily.label"
                defaultValue="Daily Chair Rental"
              />
              <ContentText
                as="p"
                className="stat-note"
                contentKey="join.rental.daily.note"
                defaultValue="Starts at $55 per day (max 2 days per week)."
              />
            </div>
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="join.rental.booth.value"
                defaultValue="$250"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="join.rental.booth.label"
                defaultValue="Booth Rental"
              />
              <ContentText
                as="p"
                className="stat-note"
                contentKey="join.rental.booth.note"
                defaultValue="Starts at $250 per week."
              />
            </div>
            <div className="stat-card">
              <ContentText
                as="p"
                className="stat-value"
                contentKey="join.rental.suite.value"
                defaultValue="$285"
              />
              <ContentText
                as="p"
                className="stat-label"
                contentKey="join.rental.suite.label"
                defaultValue="Private Suite Rental"
              />
              <ContentText
                as="p"
                className="stat-note"
                contentKey="join.rental.suite.note"
                defaultValue="Starts at $285 per week, based on size and availability."
              />
            </div>
          </div>
          <ContentText
            as="p"
            className="small-note"
            contentKey="join.rental.note"
            defaultValue="Booth and Private Suite Rental earn 2 free weeks of rent per year (restrictions apply)."
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <ContentText
            as="h2"
            className="section-title"
            contentKey="join.positions.title"
            defaultValue="Position Overview"
          />
          <div className="card-grid">
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.positions.item1.title"
                  defaultValue="Assistant / Junior Beauty Artist"
                />
                <ContentText
                  as="p"
                  contentKey="join.positions.item1.body"
                  defaultValue="Entry-level licensed professional with mentorship and growth opportunities."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.positions.item2.title"
                  defaultValue="Luxury Beauty Artist"
                />
                <ContentText
                  as="p"
                  contentKey="join.positions.item2.body"
                  defaultValue="Mid-level professional focused on elevated services and client retention."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.positions.item3.title"
                  defaultValue="Senior Beauty Artist"
                />
                <ContentText
                  as="p"
                  contentKey="join.positions.item3.body"
                  defaultValue="Experienced professional with leadership expectations."
                />
              </div>
            </article>
            <article className="card">
              <div className="card-body">
                <ContentText
                  as="h3"
                  contentKey="join.positions.item4.title"
                  defaultValue="Receptionist / Studio Coordinator"
                />
                <ContentText
                  as="p"
                  contentKey="join.positions.item4.body"
                  defaultValue="Responsibilities include booking, client communication, retail sales, front desk operations, and social media posting and engagement. Pay is $15 to $20 per hour with performance-based bonuses."
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
            contentKey="join.standards.title"
            defaultValue="Professional Standards"
          />
          <ul className="feature-list">
            <ContentText
              as="li"
              contentKey="join.standards.item1"
              defaultValue="Zero tolerance for unprofessional behavior, drug or alcohol use, unsanitary practices, or license non-compliance."
            />
            <ContentText
              as="li"
              contentKey="join.standards.item2"
              defaultValue="All professionals must display a valid license, maintain a clean station, and follow studio policies."
            />
          </ul>
        </div>
      </section>

      <section className="section cta">
        <div className="container cta-inner">
          <ContentText
            as="h2"
            contentKey="join.apply.title"
            defaultValue="How to Apply"
          />
          <ContentText
            as="p"
            contentKey="join.apply.body"
            defaultValue="Submit your resume, brief introduction, and portfolio or social media link to:"
          />
          <ContentLink
            className="btn"
            contentKey="join.apply.email.href"
            defaultHref="mailto:milabeestudios@gmail.com"
          >
            <ContentText
              as="span"
              contentKey="join.apply.email.label"
              defaultValue="milabeestudios@gmail.com"
            />
          </ContentLink>
          <p className="small-note">
            <ContentText
              as="span"
              contentKey="join.apply.website.label"
              defaultValue="Website:"
            />{" "}
            <ContentLink
              contentKey="join.apply.website.link.href"
              defaultHref="https://milabeestudios.com"
              target="_blank"
              rel="noopener"
            >
              <ContentText
                as="span"
                contentKey="join.apply.website.link.label"
                defaultValue="milabeestudios.com"
              />
            </ContentLink>
          </p>
        </div>
      </section>
    </main>
  );
}
