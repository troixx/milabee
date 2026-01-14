"use client";

import { ContentText } from "@/components/content";

export default function PoliciesPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="policies.hero.title"
            defaultValue="Salon Policies"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="policies.hero.subtitle"
            defaultValue="To ensure a professional, clean, and respectful environment for both clients and stylists, the following policies are strictly enforced."
          />
        </div>
      </section>

      <section className="section">
        <div className="container card-grid">
          <article className="card">
            <div className="card-body">
              <ContentText
                as="h2"
                contentKey="policies.client.title"
                defaultValue="Client Policies"
              />
              <ul className="feature-list">
                <ContentText
                  as="li"
                  contentKey="policies.client.item1"
                  defaultValue="Appointments must be canceled or rescheduled at least 48 hours in advance."
                />
                <ContentText
                  as="li"
                  contentKey="policies.client.item2"
                  defaultValue="A non-refundable deposit is required to secure all appointments."
                />
                <ContentText
                  as="li"
                  contentKey="policies.client.item3"
                  defaultValue="If you are more than 10 minutes late, your appointment will be canceled, and your deposit will be forfeited."
                />
                <ContentText
                  as="li"
                  contentKey="policies.client.item4"
                  defaultValue="No children under the age of 6 are permitted in the salon."
                />
                <ContentText
                  as="li"
                  contentKey="policies.client.item5"
                  defaultValue="Clear communication is required regarding services, expectations, and scheduling."
                />
                <ContentText
                  as="li"
                  contentKey="policies.client.item6"
                  defaultValue="All sales are final on retail products."
                />
                <ContentText
                  as="li"
                  contentKey="policies.client.item7"
                  defaultValue="No refunds on services once rendered."
                />
              </ul>
            </div>
          </article>
          <article className="card">
            <div className="card-body">
              <ContentText
                as="h2"
                contentKey="policies.stylist.title"
                defaultValue="Stylist Policies"
              />
              <ul className="feature-list">
                <ContentText
                  as="li"
                  contentKey="policies.stylist.item1"
                  defaultValue="All stylists are expected to maintain professionalism, cleanliness, and punctuality."
                />
                <ContentText
                  as="li"
                  contentKey="policies.stylist.item2"
                  defaultValue="Stations must be kept clean and organized at all times."
                />
                <ContentText
                  as="li"
                  contentKey="policies.stylist.item3"
                  defaultValue="Respectful communication with clients and fellow stylists is required."
                />
                <ContentText
                  as="li"
                  contentKey="policies.stylist.item4"
                  defaultValue="Timeliness for appointments is mandatory."
                />
                <ContentText
                  as="li"
                  contentKey="policies.stylist.item5"
                  defaultValue="Maintaining a positive, collaborative salon environment is essential."
                />
                <ContentText
                  as="li"
                  contentKey="policies.stylist.item6"
                  defaultValue="Failure to follow salon policies may result in termination of rental or commission agreements."
                />
              </ul>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
