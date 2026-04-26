# Wedding Invite — Design Spec

**Date:** 2026-04-25
**Status:** Draft, pending implementation plan

## Goal

Add a per-family wedding invitation page at `/marriages/{uuid}`. Each UUID maps to a Firestore document holding the family's display name and a per-family attendance cap. Guests pick the number attending (0 through their cap) and save; the count is written back to Firestore. The guest list is managed by adding documents directly in the Firestore console — no admin UI in this app.

## Non-goals

- No admin / management UI inside the app. Families are added in the Firestore console.
- No login or authenticated users. The UUID in the URL is the only access boundary.
- No email or SMS confirmations.
- No "view all RSVPs" page. The Firestore console is the source of truth for responses.
- No analytics on link opens vs. RSVPs.
- No automated test suite (pragmatic manual verification only — see Testing).

## Architecture

**Route group with its own root layout** so the invite page does not inherit the portfolio's `Header`/`Footer` from `src/app/layout.tsx`.

```
src/
├── app/
│   ├── (wedding)/                          # route group — no URL segment
│   │   ├── layout.tsx                      # own <html>/<body>, serif font, soft palette
│   │   └── marriages/
│   │       └── [uuid]/
│   │           ├── page.tsx                # server component: reads Firestore, renders
│   │           ├── RsvpForm.tsx            # "use client" — picker + save button
│   │           ├── actions.ts              # server action: submitRsvp(uuid, count)
│   │           ├── not-found.tsx           # invalid UUID page
│   │           └── styles.module.scss      # page-level styles
│   └── resources/
│       └── wedding.ts                      # static wedding details (couple, date, venue, etc.)
└── lib/
    └── firebase-admin.ts                   # singleton Admin SDK init; exports Firestore `db`
```

**Cleanup of stale scaffolding:**
- Delete `src/app/invite/`
- Delete `src/app/api/wedding/`
- Delete `src/components/invite/`

**Why server action over API route:** Save is a one-shot mutation tightly coupled to the page. Server actions are the Next 14 idiom — no fetch/JSON/status-code boilerplate, automatic CSRF, and `revalidatePath` re-renders the page server-side after mutation.

**Why route group `(wedding)`:** Lets us declare a fresh `<html>`/`<body>` in `(wedding)/layout.tsx`, fully bypassing the portfolio root layout. The `(wedding)` segment is invisible in URLs — the public path stays `/marriages/{uuid}`.

## Data model

### Firestore — collection `invites`

Document ID = the UUID that appears in the URL.

```ts
// invites/{uuid}
{
  familyName: string         // "Aleena and Family"  — set when doc is created
  maxCount: number           // 1..7 — per-family cap
  attendingCount: number | null   // null = not yet responded; 0 = declined; N = attending
  respondedAt: Timestamp | null   // null until first save; set on every save
}
```

When adding a new family in the Firestore console, populate `familyName` and `maxCount`; leave the other two `null`. Use Firestore auto-IDs (20-char URL-safe random) as document IDs — they are unguessable.

### Static config — `src/app/resources/wedding.ts`

Same for every guest. Edit-and-redeploy.

```ts
export const wedding = {
  couple: { primary: "...", partner: "..." },
  dateISO: "YYYY-MM-DD",          // for ordering & deadline math
  dateDisplay: "...",             // human-readable for UI
  time: "...",
  venue: { name: "...", address: "...", mapUrl: "..." },
  dressCode: "...",
  heroImage: "/images/wedding/hero.jpg",
  rsvpDeadlineISO: "YYYY-MM-DD",
} as const;
```

The user fills in real values; this design fixes only the shape.

## Page rendering & UX

### Server-side render (`page.tsx`)

1. Initialize / reuse the firebase-admin singleton from `src/lib/firebase-admin.ts`.
2. Read `invites/{uuid}` via the Admin SDK.
3. If the doc does not exist, call `notFound()` → renders `not-found.tsx`.
4. Otherwise render the full page server-side: hero image, family name, couple, date/time, venue with map link, dress code, RSVP deadline, and the `<RsvpForm>` client component pre-filled with `attendingCount` and `maxCount`.

### Page composition (top to bottom)

```
[Hero image — full-width, soft overlay]
"<familyName>"
"You're invited to our wedding"
<couple.primary> & <couple.partner>

<date> · <time>
<venue.name>
<venue.address>  →  View on map
Dress code: <dressCode>

Please RSVP by <rsvpDeadline>

How many will attend?
[ 0 ] [ 1 ] [ 2 ] ... [ maxCount ]

         [ Save RSVP ]
```

### Picker (`RsvpForm`, client component)

- Renders buttons `0` through `maxCount` inline.
- First visit (`attendingCount === null`): no button selected; Save is disabled until a choice is made.
- Revisit (already RSVP'd): previous count pre-selected; user can change it and re-save.
- Save click calls server action `submitRsvp(uuid, count)` via `useTransition`. Pending state disables the picker and shows a spinner on Save.

### Save outcomes

- **Success:** server action calls `revalidatePath('/marriages/{uuid}')`; the page re-renders with the new value. A success message — "Thanks — your RSVP is saved." — slides in above the picker. Picker remains active for further edits until the deadline.
- **Failure:** action returns `{ error: string }`. Form catches it and shows an inline error ("Couldn't save — please try again."). Selected count is preserved.

### After RSVP deadline

- Picker buttons render but are `disabled`. Save button is hidden.
- Banner above picker reads either "You RSVP'd: N attending" (if `attendingCount` is set) or "RSVPs are closed." (if `null`).

### Invalid UUID

- `not-found.tsx` renders a minimal "This invite link isn't valid — please check with us" message inside the same `(wedding)/layout.tsx`. No portfolio chrome.

## Server action — `submitRsvp(uuid, count)`

Validation order, every save:

1. **UUID format** — non-empty string, reasonable length. Reject garbage before hitting Firestore.
2. **Doc exists** — `db.doc('invites/{uuid}').get()`. If `!snap.exists`, return `{ error: 'invalid-invite' }`.
3. **Count bounds** — `Number.isInteger(count) && count >= 0 && count <= snap.data().maxCount`. **`maxCount` is read from the doc, not from the client**, so a tampered request submitting `count=999` is rejected.
4. **Deadline** — `Date.now() <= Date.parse(wedding.rsvpDeadlineISO + 'T23:59:59')`. If past, return `{ error: 'closed' }`.

If all pass:

```ts
db.doc(`invites/${uuid}`).update({
  attendingCount: count,
  respondedAt: FieldValue.serverTimestamp(),
});
revalidatePath(`/marriages/${uuid}`);
return { ok: true };
```

The action is idempotent — re-running with the same `count` is a no-op writeback that overwrites `respondedAt`. Double-clicks are guarded by `useTransition`'s pending state.

## Security

### Firestore rules

All reads/writes go through the server (Admin SDK bypasses rules anyway), so client rules can be locked tight:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invites/{uuid} {
      allow read, write: if false;
    }
  }
}
```

Apply manually in the Firebase console. Wiring `firebase deploy` into this project is out of scope.

### Threat model

The UUID in the URL is the only access boundary. Anyone with the link can RSVP for that family.

Mitigations:

- Use Firestore auto-IDs (20-char random) as document IDs — unguessable.
- Do not expose any list of UUIDs anywhere — no sitemap entry, no link from the homepage.
- `robots.txt` disallows `/marriages/*` so links are not indexed.
- The page itself sets `<meta name="robots" content="noindex,nofollow">` as a belt-and-braces measure.

This is acceptable for a wedding: worst case is a guest's friend submits an RSVP for them; no PII is exposed beyond the family display name the guest already knows.

## Edge cases

- **Multiple tabs / double-click on Save:** action is idempotent; `useTransition` disables the button while in-flight.
- **firebase-admin init failure at runtime:** log + render a generic error page. Surfaces in dev when env vars are missing.
- **Slow network on save:** pending state shown for the full duration; no client-side timeout.
- **Browser back after save:** page is a fresh server render and reflects the saved state.

## Testing

No test framework exists in this repository, and adding one just for this feature is not worth the cost. Manual verification checklist, run before merging:

1. Add `invites/test-uuid` in Firestore console with `familyName: "Test Family"`, `maxCount: 4`, `attendingCount: null`, `respondedAt: null`.
2. Open `http://localhost:3000/marriages/test-uuid`. Confirm hero, couple, date, venue, dress code render; family name reads "Test Family"; picker shows buttons 0–4; no button selected; Save disabled.
3. Tap "3", click Save. Confirm success message; Firestore doc now has `attendingCount: 3` and a `respondedAt` timestamp.
4. Reload page. Confirm "3" is pre-selected.
5. Change to "1", save again. Confirm Firestore updates to 1.
6. Open `/marriages/does-not-exist`. Confirm `not-found.tsx` renders; no portfolio chrome.
7. Temporarily set `rsvpDeadlineISO` in `wedding.ts` to a past date. Confirm picker disabled and the appropriate banner shows. Revert before commit.
8. Tamper test: in browser devtools, mutate the form to submit `count=999`. Confirm action rejects and Firestore is unchanged.
9. `npm run build` and run the production server. Confirm route renders the same way.
10. `curl /robots.txt`. Confirm `Disallow: /marriages/`.
11. Open the test URL on a phone. Confirm picker buttons are tappable and layout does not break.

### Definition of done

- All 11 checklist items pass on the local dev server and on the production build.
- Empty `src/app/invite/`, `src/app/api/wedding/`, `src/components/invite/` scaffolds are removed.
- At least one real (non-test) family document is added to Firestore so the live URL works on deploy.

## Open items the user must supply at implementation time

- Real values for every field in `src/app/resources/wedding.ts` (couple names, date, time, venue, dress code, hero image asset, RSVP deadline).
- The hero image file at the path referenced by `wedding.heroImage`.
- A serif font choice (Google Font name or self-hosted) for the wedding aesthetic, plus the soft palette tokens (cream / blush / sage hex values).
