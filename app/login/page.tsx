"use client";

import AuthForm from "@/components/auth-form";
import { ContentText } from "@/components/content";

export default function LoginPage() {
  return (
    <main>
      <section className="hero hero--plain">
        <div className="container hero-content">
          <ContentText
            as="p"
            className="section-kicker"
            contentKey="login.hero.kicker"
            defaultValue="Store Login"
          />
          <ContentText
            as="h1"
            className="hero-title"
            contentKey="login.hero.title"
            defaultValue="Access your store account"
          />
          <ContentText
            as="p"
            className="hero-subtitle"
            contentKey="login.hero.subtitle"
            defaultValue="Sign in to save your cart and track orders."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AuthForm />
        </div>
      </section>
    </main>
  );
}
