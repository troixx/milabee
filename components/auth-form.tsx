"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase, SUPABASE_CONFIG_OK } from "@/lib/supabaseClient";
import { ContentText } from "./content";

type StatusState = "error" | "success" | "info" | "";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [status, setStatus] = useState<{ text: string; state: StatusState }>({
    text: "",
    state: ""
  });

  useEffect(() => {
    if (!SUPABASE_CONFIG_OK) {
      setStatus({
        text: "Set your Supabase URL and anon key in your environment variables.",
        state: "error"
      });
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data && data.user) {
        router.push("/store");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!SUPABASE_CONFIG_OK) {
      setStatus({
        text: "Set your Supabase URL and anon key in your environment variables.",
        state: "error"
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      setStatus({ text: "Enter your email and password.", state: "error" });
      return;
    }

    setStatus({ text: "Working...", state: "info" });
    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus({ text: error.message, state: "error" });
        return;
      }
      router.push("/store");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus({ text: error.message, state: "error" });
      return;
    }

    if (data && data.session) {
      router.push("/store");
      return;
    }

    setStatus({
      text: "Check your email to confirm your account, then sign in.",
      state: "info"
    });
  }

  const isSignIn = mode === "sign-in";

  return (
    <div className="form-card">
      <ContentText
        as="p"
        className="section-kicker"
        contentKey="login.card.kicker"
        defaultValue="Store Access"
      />
      <ContentText
        as="h2"
        contentKey={isSignIn ? "login.copy.title.signin" : "login.copy.title.signup"}
        defaultValue={isSignIn ? "Sign in to the store" : "Create your store account"}
      />
      <ContentText
        as="p"
        className="lead"
        contentKey={isSignIn ? "login.copy.subtitle.signin" : "login.copy.subtitle.signup"}
        defaultValue={
          isSignIn
            ? "Access your saved cart and order history."
            : "Create an account to save your cart and orders."
        }
      />
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <ContentText
            as="label"
            htmlFor="email"
            contentKey="login.form.email.label"
            defaultValue="Email"
          />
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form-field">
          <ContentText
            as="label"
            htmlFor="password"
            contentKey="login.form.password.label"
            defaultValue="Password"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            minLength={6}
            required
          />
        </div>
        <div className="auth-actions">
          <button className="btn" type="submit">
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
          >
            {isSignIn ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
        <p className="status-message" data-state={status.state || undefined}>
          {status.text}
        </p>
      </form>
      <ContentText
        as="p"
        className="small-note"
        contentKey="login.card.note"
        defaultValue="By creating an account, you can keep your cart and order history synced."
      />
    </div>
  );
}
