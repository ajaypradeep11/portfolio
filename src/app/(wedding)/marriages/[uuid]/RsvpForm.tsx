"use client";

import { useState, useTransition } from "react";

import { submitRsvp, type SubmitRsvpResult } from "./actions";
import styles from "./styles.module.scss";

interface RsvpFormProps {
  uuid: string;
  maxCount: number;
  initialCount: number | null;
  locked: boolean;
}

const ERROR_COPY: Record<
  Exclude<SubmitRsvpResult, { ok: true }>["error"],
  string
> = {
  "invalid-invite": "This invite link isn't valid.",
  "out-of-range": "That number is outside the allowed range.",
  closed: "RSVPs are closed.",
  internal: "Couldn't save — please try again.",
};

export function RsvpForm({ uuid, maxCount, initialCount, locked }: RsvpFormProps) {
  const [selected, setSelected] = useState<number | null>(initialCount);
  const [status, setStatus] = useState<"idle" | "saved" | "error">(
    initialCount !== null ? "saved" : "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const choices = Array.from({ length: maxCount + 1 }, (_, i) => i);

  function handleSelect(n: number) {
    if (locked || pending) return;
    setSelected(n);
    setStatus("idle");
    setErrorMsg(null);
  }

  function handleSave() {
    if (selected === null || locked) return;
    startTransition(async () => {
      const result = await submitRsvp(uuid, selected);
      if (result.ok) {
        setStatus("saved");
        setErrorMsg(null);
      } else {
        setStatus("error");
        setErrorMsg(ERROR_COPY[result.error]);
      }
    });
  }

  return (
    <div className={styles.form}>
      <p className={styles.formPrompt}>How many will attend?</p>

      <div className={styles.choices} role="radiogroup" aria-label="Attendee count">
        {choices.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected === n}
            disabled={locked || pending}
            className={
              selected === n
                ? `${styles.choice} ${styles.choiceSelected}`
                : styles.choice
            }
            onClick={() => handleSelect(n)}
          >
            {n}
          </button>
        ))}
      </div>

      {!locked && (
        <button
          type="button"
          className={styles.saveBtn}
          disabled={selected === null || pending}
          onClick={handleSave}
        >
          {pending ? "Saving&hellip;" : "Save RSVP"}
        </button>
      )}

      {status === "saved" && !pending && (
        <p className={styles.saveSuccess}>Thanks — your RSVP is saved.</p>
      )}
      {status === "error" && errorMsg && (
        <p className={styles.saveError}>{errorMsg}</p>
      )}
      {locked && initialCount !== null && (
        <p className={styles.lockedNote}>
          You RSVP&rsquo;d: {initialCount} attending.
        </p>
      )}
      {locked && initialCount === null && (
        <p className={styles.lockedNote}>RSVPs are closed.</p>
      )}
    </div>
  );
}
