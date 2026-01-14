"use client";

import { useEffect } from "react";

type RedirectPageProps = {
  href: string;
  label: string;
};

export default function RedirectPage({ href, label }: RedirectPageProps) {
  useEffect(() => {
    window.location.href = href;
  }, [href]);

  return (
    <main className="section">
      <div className="container">
        <h1>Page moved</h1>
        <p>
          This page has moved. <a href={href}>{label}</a>.
        </p>
      </div>
    </main>
  );
}
