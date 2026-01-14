"use client";

import { ContentText } from "@/components/content";

export default function FaqPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="faq.hero.title"
            defaultValue="FAQ"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="faq.hero.subtitle"
            defaultValue="Frequently Asked Questions"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-list">
            <details className="faq-item">
              <ContentText
                as="summary"
                contentKey="faq.item1.question"
                defaultValue="Do you offer refunds?"
              />
              <ContentText
                as="p"
                contentKey="faq.item1.answer"
                defaultValue="No. All services and retail product sales are final."
              />
            </details>
            <details className="faq-item">
              <ContentText
                as="summary"
                contentKey="faq.item2.question"
                defaultValue="What happens if I am late to my appointment?"
              />
              <ContentText
                as="p"
                contentKey="faq.item2.answer"
                defaultValue="Appointments that are 10 minutes late or more will be canceled, and deposits are non-refundable."
              />
            </details>
            <details className="faq-item">
              <ContentText
                as="summary"
                contentKey="faq.item3.question"
                defaultValue="Do you allow children in the salon?"
              />
              <ContentText
                as="p"
                contentKey="faq.item3.answer"
                defaultValue="Children under the age of 6 are not permitted."
              />
            </details>
            <details className="faq-item">
              <ContentText
                as="summary"
                contentKey="faq.item4.question"
                defaultValue="How far in advance do I need to cancel my appointment?"
              />
              <ContentText
                as="p"
                contentKey="faq.item4.answer"
                defaultValue="At least 48 hours prior to your scheduled appointment."
              />
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
