"use client";

import { useTransition } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { oAuthSignIn } from "./actions";
import styles from "./login.module.css";

export function OAuthButtons() {
  const [pending, startTransition] = useTransition();

  return (
    <button type="button" className={styles.googleButton} disabled={pending} aria-busy={pending}
      onClick={() => startTransition(async () => { await oAuthSignIn("google"); })}>
      {pending ? <LoaderCircle size={21} className={styles.spin} aria-hidden="true" /> : (
        <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z" />
          <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.06.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.07v2.59A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.51H3.07a10 10 0 0 0 0 8.98L6.4 13.9Z" />
          <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.83 1.52l2.88-2.88A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.51L6.4 10.1c.79-2.37 3-4.13 5.6-4.13Z" />
        </svg>
      )}
      <span>{pending ? "Connecting to Google…" : "Continue with Google"}</span>
      {!pending && <ArrowRight size={17} aria-hidden="true" />}
    </button>
  );
}
