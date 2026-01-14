"use client";

import StoreSection from "@/components/store-section";
import { ContentText } from "@/components/content";

export default function StorePage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="p"
            className="section-kicker"
            contentKey="store.hero.kicker"
            defaultValue="Studio Store"
          />
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="store.hero.title"
            defaultValue="Mila Bee Studios Store"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="store.hero.subtitle"
            defaultValue="Shop curated hair care essentials and save your cart to your account."
          />
        </div>
      </section>

      <StoreSection />
    </main>
  );
}
