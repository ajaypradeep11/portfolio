"use client";

import { useState, useTransition } from "react";

import { loginAdmin } from "./actions";
import styles from "./styles.module.scss";

export function LoginForm({ notConfigured }: { notConfigured: boolean }) {
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    notConfigured
      ? "Admin password not configured. Set WEDDING_ADMIN_PASSWORD in .env.local and restart the dev server."
      : null,
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (notConfigured) return;
    setError(null);
    startTransition(async () => {
      const res = await loginAdmin(password);
      if (res.ok) {
        setPassword("");
        // Server-side cookie is set; the page will re-render with admin view.
        window.location.reload();
      } else if (res.error === "rate-limited") {
        const minutes = Math.ceil((res.retryAfterSeconds ?? 0) / 60);
        setError(`Too many failed attempts. Try again in ~${minutes} min.`);
      } else if (res.error === "not-configured") {
        setError("Admin password not configured.");
      } else {
        setError("Incorrect password.");
      }
    });
  }

  return (
    <main className={styles.loginShell}>
      <form className={styles.loginCard} onSubmit={onSubmit}>
        <h1 className={styles.loginHeading}>Admin sign-in</h1>
        <p className={styles.loginNote}>Enter the admin password to continue.</p>

        <label className={styles.loginLabel}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending || notConfigured}
            autoFocus
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={pending || notConfigured || password.length === 0}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>

        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </main>
  );
}
