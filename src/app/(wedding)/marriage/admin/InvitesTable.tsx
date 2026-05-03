"use client";

import { useEffect, useState, useTransition } from "react";

import {
  createInvite,
  deleteInvite,
  logoutAdmin,
  updateInvite,
} from "./actions";
import styles from "./styles.module.scss";

export interface InviteRow {
  id: string;
  familyName: string;
  maxCount: number;
  attendingCount: number | null;
  respondedAtISO: string | null;
  includeFamilySuffix: boolean;
}

interface InvitesTableProps {
  rows: InviteRow[];
}

export function InvitesTable({ rows }: InvitesTableProps) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const totalInvites = rows.length;
  const totalSeats = rows.reduce((sum, r) => sum + r.maxCount, 0);
  const totalAttending = rows.reduce(
    (sum, r) => sum + (r.attendingCount ?? 0),
    0,
  );
  const totalResponded = rows.filter((r) => r.attendingCount !== null).length;

  return (
    <div className={styles.tableWrap}>
      <div className={styles.adminHeaderRow}>
        <div className={styles.statsGrid}>
          <Stat label="Invites" value={totalInvites} />
          <Stat label="Seats allotted" value={totalSeats} />
          <Stat label="Attending" value={totalAttending} />
          <Stat
            label="Responded"
            value={`${totalResponded} / ${totalInvites}`}
          />
        </div>
        <SignOutButton />
      </div>

      <CreateInviteRow />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Family</th>
            <th title={'Append "and Family" to the invite display'}>
              + Family
            </th>
            <th>Max</th>
            <th>Attending</th>
            <th>Responded</th>
            <th>Invite link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>
                No invites yet — add one above.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <InviteTableRow key={row.id} row={row} origin={origin} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className={styles.secondaryBtn}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logoutAdmin();
          window.location.reload();
        })
      }
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

function CreateInviteRow() {
  const [familyName, setFamilyName] = useState("");
  const [maxCount, setMaxCount] = useState("4");
  const [includeFamilySuffix, setIncludeFamilySuffix] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFamilyName("");
    setMaxCount("4");
    setIncludeFamilySuffix(false);
  }

  function onAdd() {
    setError(null);
    const count = Number(maxCount);
    if (!familyName.trim()) {
      setError("Family name required.");
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      setError("Max count must be a whole number 1–50.");
      return;
    }
    startTransition(async () => {
      const res = await createInvite({
        familyName: familyName.trim(),
        maxCount: count,
        includeFamilySuffix,
      });
      if (res.ok) {
        reset();
        // Server revalidates the path; refresh to pull new data.
        window.location.reload();
      } else if (res.error === "unauthorized") {
        setError("Session expired. Please sign in again.");
      } else if (res.error === "invalid") {
        setError("Invalid input.");
      } else {
        setError("Couldn’t save — try again.");
      }
    });
  }

  return (
    <div className={styles.createRow}>
      <input
        className={styles.input}
        type="text"
        placeholder="Family name (e.g. Alli)"
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
        disabled={pending}
      />
      <input
        className={`${styles.input} ${styles.inputNumber}`}
        type="number"
        min={1}
        max={50}
        placeholder="Max"
        value={maxCount}
        onChange={(e) => setMaxCount(e.target.value)}
        disabled={pending}
      />
      <label className={styles.suffixToggle}>
        <input
          type="checkbox"
          checked={includeFamilySuffix}
          onChange={(e) => setIncludeFamilySuffix(e.target.checked)}
          disabled={pending}
        />
        <span>Append &ldquo;and Family&rdquo;</span>
      </label>
      <button
        type="button"
        className={styles.primaryBtn}
        disabled={pending}
        onClick={onAdd}
      >
        {pending ? "Adding…" : "Add invite"}
      </button>
      {error && <span className={styles.errorInline}>{error}</span>}
    </div>
  );
}

function InviteTableRow({ row, origin }: { row: InviteRow; origin: string }) {
  const [editing, setEditing] = useState(false);
  const [familyName, setFamilyName] = useState(row.familyName);
  const [maxCount, setMaxCount] = useState(String(row.maxCount));
  const [suffixOn, setSuffixOn] = useState(row.includeFamilySuffix);
  const [suffixPending, setSuffixPending] = useState(false);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteUrl = origin ? `${origin}/marriages/${row.id}` : `/marriages/${row.id}`;

  function startEdit() {
    setFamilyName(row.familyName);
    setMaxCount(String(row.maxCount));
    setError(null);
    setEditing(true);
  }

  function saveEdit() {
    setError(null);
    const count = Number(maxCount);
    if (!familyName.trim()) {
      setError("Family name required.");
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      setError("Max count 1–50.");
      return;
    }
    startTransition(async () => {
      const res = await updateInvite(row.id, {
        familyName: familyName.trim(),
        maxCount: count,
      });
      if (res.ok) {
        setEditing(false);
        window.location.reload();
      } else if (res.error === "unauthorized") {
        setError("Session expired.");
      } else {
        setError("Couldn’t save.");
      }
    });
  }

  function onDelete() {
    if (!window.confirm(`Delete invite for "${row.familyName}"? This cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteInvite(row.id);
      if (res.ok) {
        window.location.reload();
      } else {
        setError("Couldn’t delete.");
      }
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  async function toggleSuffix(next: boolean) {
    setError(null);
    const previous = suffixOn;
    setSuffixOn(next);
    setSuffixPending(true);
    const res = await updateInvite(row.id, { includeFamilySuffix: next });
    setSuffixPending(false);
    if (!res.ok) {
      setSuffixOn(previous);
      setError(
        res.error === "unauthorized" ? "Session expired." : "Couldn’t save.",
      );
    }
  }

  return (
    <tr>
      <td>
        {editing ? (
          <input
            className={styles.input}
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            disabled={pending}
          />
        ) : (
          row.familyName
        )}
      </td>
      <td className={styles.toggleCell}>
        <input
          type="checkbox"
          checked={suffixOn}
          onChange={(e) => toggleSuffix(e.target.checked)}
          disabled={suffixPending}
          aria-label={`Append "and Family" for ${row.familyName}`}
        />
      </td>
      <td className={styles.numCell}>
        {editing ? (
          <input
            className={`${styles.input} ${styles.inputNumber}`}
            type="number"
            min={1}
            max={50}
            value={maxCount}
            onChange={(e) => setMaxCount(e.target.value)}
            disabled={pending}
          />
        ) : (
          row.maxCount
        )}
      </td>
      <td className={styles.numCell}>
        {row.attendingCount === null ? "—" : row.attendingCount}
      </td>
      <td className={styles.dateCell}>
        {row.respondedAtISO ? formatDate(row.respondedAtISO) : "—"}
      </td>
      <td className={styles.linkCell}>
        <code className={styles.inlineCode}>/marriages/{row.id}</code>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={copyLink}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </td>
      <td className={styles.actionsCell}>
        {editing ? (
          <>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={saveEdit}
              disabled={pending}
            >
              Save
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => setEditing(false)}
              disabled={pending}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={startEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={onDelete}
              disabled={pending}
            >
              Delete
            </button>
          </>
        )}
        {error && <div className={styles.errorInline}>{error}</div>}
      </td>
    </tr>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
