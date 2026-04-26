import styles from "./styles.module.scss";

export default function InviteNotFound() {
  return (
    <main className={styles.notFound}>
      <h1>This invite link isn't valid</h1>
      <p>Please check the link or get in touch with us.</p>
    </main>
  );
}
