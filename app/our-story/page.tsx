"use client";

import { ContentImage, ContentLink, ContentText } from "@/components/content";

export default function OurStoryPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="our-story.hero.title"
            defaultValue="Our Story"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContentText
            as="p"
            className="lead"
            contentKey="our-story.body.lead"
            defaultValue="Mila Bee Studios was created with intention to bring back the feeling of an old-school salon community while delivering a modern luxury experience."
          />
          <ContentText
            as="p"
            contentKey="our-story.body.paragraph1"
            defaultValue="Founded by a licensed cosmetologist with over 15 years of experience, Mila Bee Studios was built as a space where creativity, professionalism, and excellence coexist. After being licensed in 2007, our founder envisioned a salon that not only prioritizes healthy hair and high-quality services, but also supports stylists as artists, giving them the freedom to grow, create, and thrive in a supportive environment."
          />
          <ContentText
            as="p"
            contentKey="our-story.body.paragraph2"
            defaultValue="At Mila Bee Studios, we believe luxury is not just about appearance, it is about how you are treated, the atmosphere you are in, and the care put into every service. Our goal is to provide clients with exceptional beauty services while maintaining a salon culture rooted in respect, creativity, and community."
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="container split">
          <div className="split-media">
            <ContentImage
              contentKey="our-story.luxury.image"
              defaultSrc="/assets/images/studio-abstract-1.svg"
              alt="Mila Bee Studios atmosphere"
            />
          </div>
          <div className="split-content">
            <ContentText
              as="h2"
              contentKey="our-story.luxury.title"
              defaultValue="Luxury with purpose"
            />
            <ContentText
              as="p"
              contentKey="our-story.luxury.body"
              defaultValue="We believe luxury is built on how clients are treated and how professionals are supported. Every service is rooted in care, craftsmanship, and community."
            />
            <ContentLink
              className="btn btn-secondary"
              contentKey="our-story.luxury.cta.href"
              defaultHref="/contact"
            >
              <ContentText
                as="span"
                contentKey="our-story.luxury.cta.label"
                defaultValue="Contact us"
              />
            </ContentLink>
          </div>
        </div>
      </section>
    </main>
  );
}
