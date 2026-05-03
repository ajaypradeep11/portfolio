# "And Family" suffix toggle — design

## Problem

The wedding invite page (`/marriages/[uuid]`) currently hardcodes `"{familyName} and Family"` for every invite. Some invitees are couples or individuals where "and Family" is wrong. The admin needs per-invite control.

## Solution

Add a per-invite boolean flag, `includeFamilySuffix`, surfaced as a checkbox in the admin UI. When `true`, the invite page renders `"{familyName} and Family"`. When `false` or missing, it renders just `"{familyName}"`.

## Data model

Add one field to invite documents in the `invites` Firestore collection:

| Field                  | Type      | Default for new docs | Notes                                      |
| ---------------------- | --------- | -------------------- | ------------------------------------------ |
| `includeFamilySuffix`  | `boolean` | `false`              | Missing/undefined treated as `false`.      |

No migration. Existing invites without the field will simply stop rendering "and Family" — this is the chosen default behaviour, not a regression.

## Admin UI changes

File: `src/app/(wedding)/marriage/admin/InvitesTable.tsx`

1. **Create form** (currently has `familyName` + `maxCount` inputs around lines 111–180): add a third control — a checkbox labeled `Include "and Family" suffix`. Defaults unchecked. Pass the value to `createInvite`.
2. **Always-active checkbox per row**: a dedicated table column holding a checkbox that's clickable at all times (no edit mode required). Toggling it immediately calls `updateInvite` with `{ includeFamilySuffix: <new value> }` and updates the row in place. This replaces the need for both a read-only indicator and an inline-edit control — one checkbox does both jobs.

While the request is in flight, the checkbox should be disabled to prevent double-clicks; on failure, revert the optimistic state and surface the existing error UI used by other mutations in this table.

## Invite display change

File: `src/app/(wedding)/marriages/[uuid]/page.tsx`

Two render sites currently use `"{invite.familyName} and Family"` (lines 85 and 126). Replace with:

```tsx
{invite.includeFamilySuffix ? `${invite.familyName} and Family` : invite.familyName}
```

(Or extract to a small helper if used in more than two places after the edit.)

## Server actions

File: `src/app/(wedding)/marriage/admin/actions.ts`

1. `createInvite` (line 69): extend the `input` type to accept `includeFamilySuffix?: boolean`. Default to `false` if not provided. Persist in the new document.
2. `updateInvite` (line 101): extend the `patch` type to accept `includeFamilySuffix?: boolean`. Apply the patch when present.

No new validation needed — it's a plain boolean.

## Type updates

Wherever the `Invite` type is defined (admin page loader, `InvitesTable` props, the `[uuid]/page.tsx` reader), add `includeFamilySuffix?: boolean`. Optional on the type so existing docs without the field still parse.

## Out of scope

- Migration script to backfill existing invites
- Batch-edit / bulk-toggle UI
- Per-language pluralization (e.g., "y familia")
- Custom suffix text per invite

## Test plan

Manual verification end-to-end:

1. Create a new invite in admin **without** checking the box → open the invite link → name shows without "and Family".
2. Create a new invite **with** the box checked → invite link shows "{name} and Family".
3. Edit an existing invite (one without the field) → toggle on → save → invite link shows "and Family".
4. Edit again → toggle off → save → invite link shows bare name.
5. Existing invites that haven't been touched → invite link shows bare name (confirms `undefined = false`).
6. Toggle the checkbox directly in the admin table (without entering edit mode) → row reflects the new state and the invite link updates on next load.
7. Simulate a failed `updateInvite` (e.g., offline) → checkbox reverts to its prior state and the existing error UI appears.
