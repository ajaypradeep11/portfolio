# Wedding Invite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-family wedding RSVP page at `/marriages/{uuid}` backed by Firestore (via `firebase-admin`). Server component reads the invite doc and renders. A client `<RsvpForm>` posts the chosen attendee count back through a Next.js server action.

**Architecture:** Route group `(wedding)` with its own nested layout for the wedding aesthetic. Portfolio chrome (Header/Footer/Background) is extracted into a `PortfolioChrome` client component that returns plain children on `/marriages/*` paths — avoiding a full multi-root layout refactor of the existing portfolio. Firestore Admin SDK runs server-side only (no client SDK, no public Firebase keys). Server action `submitRsvp` re-reads the doc to get authoritative `maxCount` so a tampered client cannot submit out-of-bounds counts.

**Tech Stack:** Next.js 14 App Router, TypeScript, `firebase-admin` v12, SCSS Modules, `next/font/google` (serif). No new test runner.

**Spec:** `docs/superpowers/specs/2026-04-25-wedding-invite-design.md`

**Note on testing:** This repository has no test framework, and the spec confirms we are not adding one. Each task's "verification" is a `npm run build` or local-server check, not an automated test. Manual verification checklist is Task 17.

---

## File map

**Create:**
- `src/lib/firebase-admin.ts` — Admin SDK singleton; exports `db`
- `src/app/resources/wedding.ts` — static wedding details
- `src/components/PortfolioChrome.tsx` — client wrapper that hides Header/Footer/Background on `/marriages/*`
- `src/app/(wedding)/layout.tsx` — nested layout for wedding aesthetic (serif font, palette)
- `src/app/(wedding)/marriages/[uuid]/page.tsx` — server component, reads Firestore
- `src/app/(wedding)/marriages/[uuid]/RsvpForm.tsx` — `"use client"` picker + save
- `src/app/(wedding)/marriages/[uuid]/actions.ts` — server action `submitRsvp`
- `src/app/(wedding)/marriages/[uuid]/not-found.tsx` — invalid UUID page
- `src/app/(wedding)/marriages/[uuid]/styles.module.scss` — page styles
- `firestore.rules` — copy-paste-ready ruleset (for the Firebase console)

**Modify:**
- `package.json`, `package-lock.json` — add `firebase-admin`
- `src/app/layout.tsx` — replace inline chrome with `<PortfolioChrome>` wrapper
- `src/app/robots.ts` — add `disallow: "/marriages/"`

**Delete (stale scaffolding):**
- `src/app/invite/` (entire dir)
- `src/components/invite/` (entire dir, if it exists on disk)
- `src/app/api/wedding/` (entire dir, if it exists on disk)

---

## Task 1: Pre-flight inspection

**Files:** none modified — read-only inspection.

- [ ] **Step 1: Inventory the stale scaffolding directories**

Run:
```bash
ls -la src/app/invite src/components/invite src/app/api/wedding 2>&1 | head -40
```

Expected: confirms which directories actually exist on disk. From the git-status snapshot they were listed as untracked, but `find` showed them empty. We need a concrete picture before Task 16 deletes them.

- [ ] **Step 2: Confirm Firebase Admin env vars are set**

Run:
```bash
grep -E '^FIREBASE_(PROJECT_ID|CLIENT_EMAIL|PRIVATE_KEY|DATABASE_ID)=' .env.local | sed 's/=.*/=***SET***/'
```

Expected: prints all four lines marked `***SET***`. If any is missing, stop and ask the user.

- [ ] **Step 3: Confirm dev server starts cleanly before any changes**

Run:
```bash
npm run dev &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
kill %1 2>/dev/null || true
```

Expected: prints `200`. Establishes a baseline so a later regression is attributable to our changes, not something pre-existing.

No commit for this task.

---

## Task 2: Install `firebase-admin`

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install the dependency**

Run:
```bash
npm install firebase-admin@^12
```

Expected: package installed; `package.json` and `package-lock.json` updated.

- [ ] **Step 2: Verify install**

Run:
```bash
node -e "console.log(require('firebase-admin/app').initializeApp ? 'ok' : 'missing')"
```

Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add firebase-admin dependency for wedding RSVP"
```

---

## Task 3: Create the firebase-admin singleton

**Files:**
- Create: `src/lib/firebase-admin.ts`

- [ ] **Step 1: Write the module**

```ts
// src/lib/firebase-admin.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let cached: Firestore | null = null;

export function getDb(): Firestore {
  if (cached) return cached;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const databaseId = process.env.FIREBASE_DATABASE_ID;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Missing Firebase Admin env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)",
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  cached =
    databaseId && databaseId !== "(default)"
      ? getFirestore(databaseId)
      : getFirestore();

  return cached;
}
```

Why a function instead of `export const db`: a top-level `getFirestore()` would run at module import — which happens at build time on Vercel without env vars and crashes the build. Lazy initialization defers it until the first request.

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: zero errors. (If new errors surface unrelated to our file, note them but proceed.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/firebase-admin.ts
git commit -m "Add firebase-admin singleton for server-side Firestore access"
```

---

## Task 4: Create static wedding config

**Files:**
- Create: `src/app/resources/wedding.ts`

- [ ] **Step 1: Write the module with placeholder values**

```ts
// src/app/resources/wedding.ts
export const wedding = {
  couple: {
    primary: "Pradeep",
    partner: "Partner Name",
  },
  dateISO: "2026-12-31",
  dateDisplay: "December 31, 2026",
  time: "5:00 PM onwards",
  venue: {
    name: "Venue Name",
    address: "123 Street, City, State",
    mapUrl: "https://maps.google.com/?q=Venue+Name",
  },
  dressCode: "Traditional",
  heroImage: "/images/wedding/hero.jpg",
  rsvpDeadlineISO: "2026-11-30",
} as const;

export type WeddingConfig = typeof wedding;
```

The values above are clearly-marked placeholders. The user replaces them with real values before deploying — see Task 18.

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: zero new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/resources/wedding.ts
git commit -m "Add static wedding config (placeholders)"
```

---

## Task 5: Extract portfolio chrome into a client wrapper

This is the architectural pivot from the spec: instead of a multi-root layout refactor, we conditionalize the chrome via `usePathname()`.

**Files:**
- Create: `src/components/PortfolioChrome.tsx`
- Modify: `src/app/layout.tsx` (lines 195–225 — replace inline Background/Header/main/Footer block with `<PortfolioChrome>`)

- [ ] **Step 1: Create `PortfolioChrome.tsx`**

```tsx
// src/components/PortfolioChrome.tsx
"use client";

import { usePathname } from "next/navigation";

import { Footer, Header, RouteGuard } from "@/components";
import { effects } from "@/app/resources";
import { Background, Column, Flex } from "@/once-ui/components";

interface PortfolioChromeProps {
  children: React.ReactNode;
}

export function PortfolioChrome({ children }: PortfolioChromeProps) {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/marriages")) {
    return <>{children}</>;
  }

  return (
    <Column as="div" fillWidth margin="0" padding="0">
      <Background
        mask={{
          cursor: effects.mask.cursor,
          x: effects.mask.x,
          y: effects.mask.y,
          radius: effects.mask.radius,
        }}
        gradient={{
          display: effects.gradient.display,
          x: effects.gradient.x,
          y: effects.gradient.y,
          width: effects.gradient.width,
          height: effects.gradient.height,
          tilt: effects.gradient.tilt,
          colorStart: effects.gradient.colorStart,
          colorEnd: effects.gradient.colorEnd,
          opacity: effects.gradient.opacity as any,
        }}
        dots={{
          display: effects.dots.display,
          color: effects.dots.color,
          size: effects.dots.size as any,
          opacity: effects.dots.opacity as any,
        }}
        grid={{
          display: effects.grid.display,
          color: effects.grid.color,
          width: effects.grid.width as any,
          height: effects.grid.height as any,
          opacity: effects.grid.opacity as any,
        }}
        lines={{
          display: effects.lines.display,
          opacity: effects.lines.opacity as any,
        }}
      />
      <Flex fillWidth minHeight="16" />
      <Header />
      <Flex
        as="main"
        position="relative"
        zIndex={0}
        fillWidth
        paddingY="l"
        paddingX="l"
        horizontal="center"
        flex={1}
      >
        <Flex horizontal="center" fillWidth minHeight="0">
          <RouteGuard>{children}</RouteGuard>
        </Flex>
      </Flex>
      <Footer />
    </Column>
  );
}
```

Notes:
- The body of `PortfolioChrome`'s JSX is copied verbatim from `src/app/layout.tsx:195–225` so behavior is identical for portfolio routes.
- `pathname` falls back to `""` because `usePathname` can be `null` during transitions.
- `Footer` is currently a server component but uses no server-only APIs (just `new Date().getFullYear()` and `Flex`/`Text` components), so rendering it inside this client subtree works without changes.

- [ ] **Step 2: Update `src/app/layout.tsx` to use `PortfolioChrome`**

In `src/app/layout.tsx`:

a) Update imports at the top (around line 7 and line 14):
- Remove: `import { Footer, Header, RouteGuard } from "@/components";`
- Remove: `import { Background, Column, Flex, ToastProvider } from "@/once-ui/components";`
- Add: `import { PortfolioChrome } from "@/components/PortfolioChrome";`
- Add: `import { Flex, ToastProvider } from "@/once-ui/components";` (we still need `Flex` and `ToastProvider` at the top level, but `Background`, `Column`, `Header`, `Footer`, `RouteGuard` move into `PortfolioChrome`)

b) Replace lines 195–225 (the `<Background>...<Footer />` block) with:

```tsx
          <PortfolioChrome>{children}</PortfolioChrome>
```

So the layout body becomes:

```tsx
    <Flex>
      <ToastProvider>
        <PortfolioChrome>{children}</PortfolioChrome>
      </ToastProvider>
    </Flex>
```

(Wrap exactly with whatever the existing outer `<Flex>` props are — do not change them.)

- [ ] **Step 3: Type-check and build**

Run:
```bash
npx tsc --noEmit && npm run build
```

Expected: build succeeds. The home page, `/about`, `/work`, `/blog` should still render in subsequent steps.

- [ ] **Step 4: Run dev server and smoke-test portfolio routes**

Run:
```bash
npm run dev &
sleep 8
for path in / /about /work /blog; do
  echo "$path → $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$path)"
done
kill %1 2>/dev/null || true
```

Expected: all four return `200`. (HTTP-level check only; we do a visual check in Task 17.)

- [ ] **Step 5: Commit**

```bash
git add src/components/PortfolioChrome.tsx src/app/layout.tsx
git commit -m "Extract portfolio chrome into PortfolioChrome client wrapper"
```

---

## Task 6: Create wedding route group + nested layout

**Files:**
- Create: `src/app/(wedding)/layout.tsx`

- [ ] **Step 1: Write the layout**

```tsx
// src/app/(wedding)/layout.tsx
import { Cormorant_Garamond } from "next/font/google";

import styles from "./layout.module.scss";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-wedding-serif",
});

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} ${styles.weddingRoot}`}>{children}</div>
  );
}
```

Why this works without a fresh `<html>/<body>`: the parent root layout supplies the document shell; this wrapper supplies the wedding theme via a CSS variable + a class. Content inside reads `font-family: var(--font-wedding-serif)` from the SCSS module.

`metadata.robots` adds `noindex,nofollow` for any page under `(wedding)` — belt-and-braces alongside the `robots.ts` change in Task 14.

- [ ] **Step 2: Write the layout SCSS**

Create `src/app/(wedding)/layout.module.scss`:

```scss
.weddingRoot {
  --wedding-bg: #f9f4ee;       /* cream */
  --wedding-fg: #3a2e26;        /* warm dark brown */
  --wedding-accent: #b08968;    /* muted gold */
  --wedding-soft: #e8d5c4;      /* blush */

  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: var(--wedding-bg);
  color: var(--wedding-fg);
  font-family: var(--font-wedding-serif), Georgia, serif;
  z-index: 100;
}
```

`position: fixed; inset: 0; z-index: 100;` keeps the wedding view fully covering the viewport so nothing from the portfolio body bleeds through visually, even though the portfolio's body styles are still mounted in the DOM.

- [ ] **Step 3: Type-check and build**

Run:
```bash
npx tsc --noEmit && npm run build
```

Expected: build succeeds. (No route under `(wedding)/` exists yet; the layout compiles regardless.)

- [ ] **Step 4: Commit**

```bash
git add "src/app/(wedding)/layout.tsx" "src/app/(wedding)/layout.module.scss"
git commit -m "Add (wedding) route group with serif theme layout"
```

---

## Task 7: Create the not-found page for invalid UUIDs

**Files:**
- Create: `src/app/(wedding)/marriages/[uuid]/not-found.tsx`

- [ ] **Step 1: Write the page**

```tsx
// src/app/(wedding)/marriages/[uuid]/not-found.tsx
import styles from "./styles.module.scss";

export default function InviteNotFound() {
  return (
    <main className={styles.notFound}>
      <h1>This invite link isn’t valid</h1>
      <p>Please check the link or get in touch with us.</p>
    </main>
  );
}
```

The styles file is created in Task 11 — until then this page renders unstyled. That is fine because we do not exercise this route until Task 17.

- [ ] **Step 2: Commit**

```bash
git add "src/app/(wedding)/marriages/[uuid]/not-found.tsx"
git commit -m "Add invalid-invite not-found page"
```

---

## Task 8: Create the server action `submitRsvp`

**Files:**
- Create: `src/app/(wedding)/marriages/[uuid]/actions.ts`

- [ ] **Step 1: Write the action**

```ts
// src/app/(wedding)/marriages/[uuid]/actions.ts
"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { wedding } from "@/app/resources/wedding";
import { getDb } from "@/lib/firebase-admin";

export type SubmitRsvpResult =
  | { ok: true }
  | { ok: false; error: "invalid-invite" | "out-of-range" | "closed" | "internal" };

const UUID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

export async function submitRsvp(
  uuid: string,
  count: number,
): Promise<SubmitRsvpResult> {
  if (typeof uuid !== "string" || !UUID_PATTERN.test(uuid)) {
    return { ok: false, error: "invalid-invite" };
  }

  if (!Number.isInteger(count) || count < 0) {
    return { ok: false, error: "out-of-range" };
  }

  const deadlineMs = Date.parse(`${wedding.rsvpDeadlineISO}T23:59:59`);
  if (!Number.isNaN(deadlineMs) && Date.now() > deadlineMs) {
    return { ok: false, error: "closed" };
  }

  try {
    const db = getDb();
    const ref = db.doc(`invites/${uuid}`);
    const snap = await ref.get();

    if (!snap.exists) {
      return { ok: false, error: "invalid-invite" };
    }

    const data = snap.data() as { maxCount?: number } | undefined;
    const maxCount = data?.maxCount;

    if (typeof maxCount !== "number" || count > maxCount) {
      return { ok: false, error: "out-of-range" };
    }

    await ref.update({
      attendingCount: count,
      respondedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath(`/marriages/${uuid}`);
    return { ok: true };
  } catch (err) {
    console.error("[submitRsvp]", err);
    return { ok: false, error: "internal" };
  }
}
```

Validation order matches the spec exactly: shape, count integer/non-negative, deadline, doc existence, count ≤ doc's `maxCount` (read server-side, never trusted from client).

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: zero new errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(wedding)/marriages/[uuid]/actions.ts"
git commit -m "Add submitRsvp server action with server-side validation"
```

---

## Task 9: Create the RSVP form (client component)

**Files:**
- Create: `src/app/(wedding)/marriages/[uuid]/RsvpForm.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/app/(wedding)/marriages/[uuid]/RsvpForm.tsx
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
  "invalid-invite": "This invite link isn’t valid.",
  "out-of-range": "That number is outside the allowed range.",
  closed: "RSVPs are closed.",
  internal: "Couldn’t save — please try again.",
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
          {pending ? "Saving…" : "Save RSVP"}
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
          You RSVP’d: {initialCount} attending.
        </p>
      )}
      {locked && initialCount === null && (
        <p className={styles.lockedNote}>RSVPs are closed.</p>
      )}
    </div>
  );
}
```

Notes:
- `choices` has length `maxCount + 1` so values 0 through `maxCount` inclusive are rendered.
- `status === "saved"` initial value comes from whether the user has already responded (`initialCount !== null`) so the "Thanks — your RSVP is saved" banner shows immediately on revisit instead of disappearing until the next save.
- `radiogroup` / `role="radio"` / `aria-checked` make the picker keyboard-accessible.

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: zero new errors. (Imports `styles.module.scss` — file does not exist yet, but TypeScript won't fail because `*.module.scss` is declared as `any` via Next's globals.)

- [ ] **Step 3: Commit**

```bash
git add "src/app/(wedding)/marriages/[uuid]/RsvpForm.tsx"
git commit -m "Add RsvpForm client component with picker and save flow"
```

---

## Task 10: Create the page (server component)

**Files:**
- Create: `src/app/(wedding)/marriages/[uuid]/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
// src/app/(wedding)/marriages/[uuid]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { wedding } from "@/app/resources/wedding";
import { getDb } from "@/lib/firebase-admin";

import { RsvpForm } from "./RsvpForm";
import styles from "./styles.module.scss";

interface InviteDoc {
  familyName: string;
  maxCount: number;
  attendingCount: number | null;
  respondedAt: FirebaseFirestore.Timestamp | null;
}

export const dynamic = "force-dynamic";

async function loadInvite(uuid: string): Promise<InviteDoc | null> {
  const snap = await getDb().doc(`invites/${uuid}`).get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<InviteDoc> | undefined;
  if (!data || typeof data.familyName !== "string" || typeof data.maxCount !== "number") {
    return null;
  }
  return {
    familyName: data.familyName,
    maxCount: data.maxCount,
    attendingCount:
      typeof data.attendingCount === "number" ? data.attendingCount : null,
    respondedAt: data.respondedAt ?? null,
  };
}

function isPastDeadline(): boolean {
  const ms = Date.parse(`${wedding.rsvpDeadlineISO}T23:59:59`);
  return !Number.isNaN(ms) && Date.now() > ms;
}

interface PageProps {
  params: { uuid: string };
}

export default async function MarriagePage({ params }: PageProps) {
  const invite = await loadInvite(params.uuid);
  if (!invite) {
    notFound();
  }

  const locked = isPastDeadline();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src={wedding.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </section>

      <section className={styles.content}>
        <p className={styles.familyName}>{invite.familyName}</p>
        <h1 className={styles.headline}>You’re invited to our wedding</h1>
        <p className={styles.couple}>
          {wedding.couple.primary} &amp; {wedding.couple.partner}
        </p>

        <dl className={styles.details}>
          <div className={styles.detailRow}>
            <dt>Date</dt>
            <dd>{wedding.dateDisplay}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Time</dt>
            <dd>{wedding.time}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Venue</dt>
            <dd>
              {wedding.venue.name}
              <br />
              {wedding.venue.address}
              <br />
              <Link href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer">
                View on map →
              </Link>
            </dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Dress code</dt>
            <dd>{wedding.dressCode}</dd>
          </div>
        </dl>

        <p className={styles.deadline}>
          Please RSVP by {formatDeadline(wedding.rsvpDeadlineISO)}
        </p>

        <RsvpForm
          uuid={params.uuid}
          maxCount={invite.maxCount}
          initialCount={invite.attendingCount}
          locked={locked}
        />
      </section>
    </main>
  );
}

function formatDeadline(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
```

Notes:
- `export const dynamic = "force-dynamic"` opts out of static rendering. Without this, Next would try to pre-render `/marriages/[uuid]` at build time and fail without a UUID list.
- `loadInvite` validates the doc shape — a malformed Firestore record (e.g. someone deletes a required field in the console) is treated as "not found" rather than crashing the page.
- `formatDeadline` reads the ISO string at request time; if the parse fails, it falls back to the raw ISO string.

- [ ] **Step 2: Type-check and build**

Run:
```bash
npx tsc --noEmit && npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(wedding)/marriages/[uuid]/page.tsx"
git commit -m "Add /marriages/[uuid] server-rendered page"
```

---

## Task 11: Style the page

**Files:**
- Create: `src/app/(wedding)/marriages/[uuid]/styles.module.scss`

- [ ] **Step 1: Write the styles**

```scss
// src/app/(wedding)/marriages/[uuid]/styles.module.scss

.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 0 6rem;
}

.hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--wedding-soft);
  margin-bottom: 2.5rem;
}

.heroImage {
  object-fit: cover;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 60%,
    rgba(58, 46, 38, 0.18)
  );
  pointer-events: none;
}

.content {
  padding: 0 1.5rem;
  text-align: center;
}

.familyName {
  font-size: 1.1rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--wedding-accent);
  margin: 0 0 1rem;
}

.headline {
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 500;
  margin: 0 0 1rem;
  line-height: 1.15;
}

.couple {
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-style: italic;
  color: var(--wedding-accent);
  margin: 0 0 2.5rem;
}

.details {
  display: grid;
  gap: 1.25rem;
  margin: 0 0 2.5rem;
  text-align: left;
  border-top: 1px solid var(--wedding-soft);
  border-bottom: 1px solid var(--wedding-soft);
  padding: 1.5rem 0;
}

.detailRow {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 1rem;
  align-items: start;

  dt {
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--wedding-accent);
    margin: 0;
  }

  dd {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.5;

    a {
      color: var(--wedding-accent);
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }
}

.deadline {
  font-style: italic;
  color: var(--wedding-accent);
  margin: 0 0 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.formPrompt {
  font-size: 1.2rem;
  margin: 0;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.choice {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  border: 1px solid var(--wedding-accent);
  background: transparent;
  color: var(--wedding-fg);
  font-family: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--wedding-soft);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
}

.choiceSelected {
  background: var(--wedding-accent);
  color: #fff;
}

.saveBtn {
  padding: 0.85rem 2.5rem;
  border-radius: 999px;
  border: none;
  background: var(--wedding-fg);
  color: var(--wedding-bg);
  font-family: inherit;
  font-size: 1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.saveSuccess {
  color: #2e6e3a;
  font-style: italic;
  margin: 0;
}

.saveError {
  color: #9c2a2a;
  margin: 0;
}

.lockedNote {
  color: var(--wedding-accent);
  font-style: italic;
  margin: 0;
}

.notFound {
  max-width: 520px;
  margin: 0 auto;
  padding: 6rem 1.5rem;
  text-align: center;

  h1 {
    font-size: 2rem;
    margin: 0 0 1rem;
  }

  p {
    margin: 0;
    color: var(--wedding-accent);
  }
}
```

- [ ] **Step 2: Build**

Run:
```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(wedding)/marriages/[uuid]/styles.module.scss"
git commit -m "Style the wedding invite page"
```

---

## Task 12: Add a placeholder hero image

**Files:**
- Create: `public/images/wedding/hero.jpg`

- [ ] **Step 1: Drop a placeholder image**

The `<Image>` component in Task 10 references `/images/wedding/hero.jpg`. Without the file, the page renders a broken image. Use any 1600×900 or wider photo as a placeholder; the user replaces it in Task 18.

```bash
mkdir -p public/images/wedding
# Use any existing repo image as a stand-in:
cp public/images/og/home.jpg public/images/wedding/hero.jpg 2>/dev/null \
  || cp public/og.jpg public/images/wedding/hero.jpg 2>/dev/null \
  || echo "WARNING: no fallback image found — drop any wide JPG at public/images/wedding/hero.jpg before Task 17"
```

If the warning prints, find any wide JPG in `public/` and copy it manually:
```bash
find public -name "*.jpg" -size +50k | head -5
cp <one-of-those> public/images/wedding/hero.jpg
```

- [ ] **Step 2: Verify the file**

Run:
```bash
file public/images/wedding/hero.jpg
```

Expected: `JPEG image data, ...`.

- [ ] **Step 3: Commit**

```bash
git add public/images/wedding/hero.jpg
git commit -m "Add placeholder wedding hero image"
```

---

## Task 13: Add a test invite to Firestore

**Manual step.** Required before Task 14's smoke test.

- [ ] **Step 1: Create the doc in the Firebase console**

In the Firebase console for the project referenced by `FIREBASE_PROJECT_ID`:
1. Open Firestore Data → select the database matching `FIREBASE_DATABASE_ID` (or `(default)` if unset).
2. Add collection `invites` if it doesn't exist.
3. Add document ID `test-invite-001` (typed manually — do not auto-generate, so the URL is predictable).
4. Fields:
   - `familyName` (string): `"Test Family"`
   - `maxCount` (number): `4`
   - `attendingCount` (null)
   - `respondedAt` (null)
5. Save.

- [ ] **Step 2: Confirm via the console** that the doc shows all four fields with the expected values.

No commit (no code change).

---

## Task 14: Smoke test the live page

**Files:** none — verification only.

- [ ] **Step 1: Run dev server**

```bash
npm run dev &
sleep 8
```

- [ ] **Step 2: Hit the test URL**

```bash
curl -s -o /tmp/wedding.html -w "status=%{http_code}\n" \
  http://localhost:3000/marriages/test-invite-001
grep -c "Test Family" /tmp/wedding.html
grep -c "How many will attend" /tmp/wedding.html
```

Expected: `status=200`, then both `grep -c` outputs at least `1`.

- [ ] **Step 3: Hit a non-existent UUID**

```bash
curl -s -o /tmp/wedding-404.html -w "status=%{http_code}\n" \
  http://localhost:3000/marriages/does-not-exist-xyz
grep -c "isn’t valid" /tmp/wedding-404.html || grep -c "isn't valid" /tmp/wedding-404.html
```

Expected: `status=404`, and the grep finds the not-found copy.

- [ ] **Step 4: Confirm portfolio chrome is absent on the wedding page**

```bash
grep -c "_Footer_" /tmp/wedding.html
```

Expected: `0` (no Footer module classes leaked into the wedding HTML — confirms the `PortfolioChrome` early-return worked).

- [ ] **Step 5: Stop dev server**

```bash
kill %1 2>/dev/null || true
```

No commit. If any step fails, debug before moving on.

---

## Task 15: Add `Disallow: /marriages/` to robots.ts

**Files:**
- Modify: `src/app/robots.ts`

- [ ] **Step 1: Replace the file contents**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

import { absoluteUrl, siteOrigin } from "@/app/resources";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/marriages/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteOrigin,
  };
}
```

- [ ] **Step 2: Verify in dev**

```bash
npm run dev &
sleep 8
curl -s http://localhost:3000/robots.txt
kill %1 2>/dev/null || true
```

Expected: output contains `Disallow: /marriages/`.

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "Disallow /marriages/ in robots"
```

---

## Task 16: Write Firestore security rules file

**Files:**
- Create: `firestore.rules`

- [ ] **Step 1: Write the file**

```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invites/{uuid} {
      allow read, write: if false;
    }
  }
}
```

The Admin SDK bypasses these rules, so the server still has full access. Rules deny any client-direct access — important because anyone could otherwise enumerate the `invites/` collection if they knew the project ID.

- [ ] **Step 2: Apply manually in the Firebase console**

In the Firebase console: **Firestore → Rules → paste the file contents → Publish**. Confirm the published version timestamp updates.

- [ ] **Step 3: Commit the rules file**

```bash
git add firestore.rules
git commit -m "Add Firestore rules denying client access to invites collection"
```

---

## Task 17: Clean up stale scaffolding

**Files:** delete (using `git rm` if tracked, plain `rm -rf` if not).

- [ ] **Step 1: Inventory what's actually on disk**

```bash
for d in src/app/invite src/components/invite src/app/api/wedding; do
  if [ -e "$d" ]; then
    echo "=== $d ==="
    find "$d" -type f -o -type d
  else
    echo "$d → does not exist"
  fi
done
```

- [ ] **Step 2: Remove what exists**

For each path that exists:
```bash
rm -rf src/app/invite
rm -rf src/components/invite
rm -rf src/app/api/wedding
```

If any path contains tracked files (unlikely, since the git-status snapshot showed them as untracked), use `git rm -r <path>` instead.

- [ ] **Step 3: Verify nothing else references these paths**

```bash
grep -rn "from.*['\"]@/app/invite\|from.*['\"]@/components/invite\|api/wedding" src/ 2>/dev/null
```

Expected: no output (no dangling imports).

- [ ] **Step 4: Build to confirm**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A src/app/invite src/components/invite src/app/api/wedding 2>/dev/null
git commit -m "Remove stale invite scaffolding superseded by /marriages route" || echo "nothing to commit"
```

---

## Task 18: Manual verification checklist (full)

Run this end-to-end before declaring the feature done. Each item maps to the spec's testing section.

- [ ] **1.** Test invite already exists in Firestore from Task 13. Confirm.
- [ ] **2.** `npm run dev`. Open `http://localhost:3000/marriages/test-invite-001` in a real browser:
  - Hero image, couple names, date, time, venue, map link, dress code all render.
  - Family name reads "Test Family".
  - Picker shows buttons 0–4.
  - No button selected on first visit; Save button is disabled.
- [ ] **3.** Tap "3", click Save. Confirm the success message appears within ~2 seconds. In the Firebase console, confirm `invites/test-invite-001` now has `attendingCount: 3` and a non-null `respondedAt`.
- [ ] **4.** Hard-reload the page (Cmd-Shift-R). Confirm "3" is pre-selected and the success message is shown.
- [ ] **5.** Tap "1", click Save. Confirm Firestore updates `attendingCount: 1`.
- [ ] **6.** Visit `http://localhost:3000/marriages/does-not-exist`. Confirm not-found page renders, no portfolio Header/Footer visible.
- [ ] **7.** Temporarily edit `src/app/resources/wedding.ts`: set `rsvpDeadlineISO` to `"2020-01-01"`. Reload `/marriages/test-invite-001`:
  - Picker buttons rendered but disabled.
  - Save button is hidden.
  - Banner reads "You RSVP'd: 1 attending."
  Revert the change before continuing (`git checkout -- src/app/resources/wedding.ts`).
- [ ] **8.** Tamper test (validates that `maxCount` is enforced server-side):
  - Open the page in the browser. The test invite has `maxCount: 4`.
  - In Firefox/Chrome devtools → Inspector, find any picker `<button>` and edit its `data-count` attribute or the `onClick` handler is harder to tamper with than just temporarily editing `RsvpForm.tsx` to render a button with value `999`. Easiest path:
    - Edit `src/app/(wedding)/marriages/[uuid]/RsvpForm.tsx`: change `Array.from({ length: maxCount + 1 }, (_, i) => i)` to `Array.from({ length: maxCount + 1 }, (_, i) => i).concat([999])` — adds a "999" button.
    - Save (dev server hot-reloads).
    - In the browser, click the "999" button, then click Save.
  - Expected: error banner reads "That number is outside the allowed range." Firestore doc's `attendingCount` is unchanged from its previous value.
  - **Revert the test edit** (`git checkout -- "src/app/(wedding)/marriages/[uuid]/RsvpForm.tsx"`) before continuing.
- [ ] **9.** Stop dev server. Run `npm run build && npm start`. Open `http://localhost:3000/marriages/test-invite-001` in production mode. Confirm same behavior as dev.
- [ ] **10.** `curl http://localhost:3000/robots.txt`. Confirm `Disallow: /marriages/` is present.
- [ ] **11.** Open `http://localhost:3000/marriages/test-invite-001` on a phone (or DevTools mobile emulator). Confirm picker buttons are tappable, hero image scales, layout doesn't break under 375px width.
- [ ] **12.** Visit `/`, `/about`, `/work`, `/blog`, `/canon`, `/tictactoe`. Confirm portfolio chrome (Header, Footer, Background) still renders normally — i.e., `PortfolioChrome` did not break the existing portfolio.

---

## Task 19: Add real invite docs in Firestore (deployment-prep)

**Manual step before deploying to production.**

- [ ] **Step 1: For each guest family, add a Firestore doc** under `invites/{auto-id}`:
  - `familyName`: e.g., `"Aleena and Family"`
  - `maxCount`: e.g., `4`
  - `attendingCount`: `null`
  - `respondedAt`: `null`

  Use **auto-generated IDs** (the "Auto ID" button in the Firebase console) — these are 20-char URL-safe random strings, unguessable.

- [ ] **Step 2: Record the URL for each family**

For each new doc, the link to share is `https://ajaypradeep.com/marriages/{auto-id}`. Save these to a private doc/spreadsheet — there is no admin UI in the app to look them up later.

- [ ] **Step 3: Replace placeholder values in `src/app/resources/wedding.ts`**

Edit the file with real values:
- `couple.partner`
- `dateISO` and `dateDisplay`
- `time`
- `venue.name`, `venue.address`, `venue.mapUrl`
- `dressCode`
- `rsvpDeadlineISO`

- [ ] **Step 4: Replace the placeholder hero image**

Drop the real image at `public/images/wedding/hero.jpg`. Recommend ≥1600×900, JPEG, ≤300 KB.

- [ ] **Step 5: Commit final config + image**

```bash
git add src/app/resources/wedding.ts public/images/wedding/hero.jpg
git commit -m "Set real wedding details and hero image"
```

- [ ] **Step 6: Delete the test invite from Firestore** (`invites/test-invite-001`) before going live.

---

## Definition of done

- All 19 tasks above are checked off.
- `firestore.rules` is published in the Firebase console.
- Test invite has been deleted; real invites exist with real `familyName` / `maxCount` values.
- `wedding.ts` and the hero image carry real (non-placeholder) values.
- The deployed site at `https://ajaypradeep.com/marriages/{real-uuid}` renders the page, accepts a save, and writes back to Firestore.
- The deployed `https://ajaypradeep.com/robots.txt` includes `Disallow: /marriages/`.
- Portfolio routes (`/`, `/about`, `/work`, `/blog`) render unchanged in production.
