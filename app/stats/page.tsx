import { getCloudflareContext } from "@opennextjs/cloudflare";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

interface SummaryRow {
  file: string;
  locale: string;
  country: string;
  count: number;
}

interface OpenRow {
  opened_at: string;
  file: string;
  locale: string;
  country: string;
}

interface LeadRow {
  created_at: string;
  name: string;
  company: string | null;
  contact: string;
  locale: string;
  country: string | null;
  telegram_status: string;
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "leads" ? "leads" : "pdf";
  const { env } = await getCloudflareContext({ async: true });

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Stats</h1>

      <nav className={styles.tabs}>
        <a href="?tab=pdf" className={`${styles.tab} ${activeTab === "pdf" ? styles.tabActive : ""}`}>
          PDF
        </a>
        <a href="?tab=leads" className={`${styles.tab} ${activeTab === "leads" ? styles.tabActive : ""}`}>
          Заявки
        </a>
      </nav>

      {activeTab === "pdf" ? (
        <PdfTab db={env.DB} />
      ) : (
        <LeadsTab db={env.DB} />
      )}
    </main>
  );
}

async function PdfTab({ db }: { db: D1Database }) {
  const [summary, recent] = await Promise.all([
    db
      .prepare(
        "SELECT file, locale, country, COUNT(*) AS count FROM opens GROUP BY file, locale, country ORDER BY count DESC",
      )
      .all<SummaryRow>()
      .then((r) => r.results),
    db
      .prepare("SELECT opened_at, file, locale, country FROM opens ORDER BY opened_at DESC LIMIT 50")
      .all<OpenRow>()
      .then((r) => r.results),
  ]);

  const total = summary.reduce((sum, row) => sum + row.count, 0);

  return (
    <>
      <h2 className={styles.sectionTitle}>PDF opens — {total} total</h2>

      <h2 className={styles.sectionTitle}>By file / language / country</h2>
      {summary.length === 0 ? (
        <p className={styles.empty}>No opens recorded yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>File</th>
              <th>Language</th>
              <th>Country</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={`${row.file}-${row.locale}-${row.country}`}>
                <td>{row.file}</td>
                <td>{row.locale}</td>
                <td>{row.country}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className={styles.sectionTitle}>Recent opens</h2>
      {recent.length === 0 ? (
        <p className={styles.empty}>No opens recorded yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>File</th>
              <th>Language</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((row, i) => (
              <tr key={i}>
                <td>{row.opened_at}</td>
                <td>{row.file}</td>
                <td>{row.locale}</td>
                <td>{row.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

async function LeadsTab({ db }: { db: D1Database }) {
  const { results: leads } = await db
    .prepare(
      "SELECT created_at, name, company, contact, locale, country, telegram_status FROM leads ORDER BY created_at DESC LIMIT 50",
    )
    .all<LeadRow>();

  return (
    <>
      <h2 className={styles.sectionTitle}>Recent leads — {leads.length}</h2>
      {leads.length === 0 ? (
        <p className={styles.empty}>No leads yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Language</th>
              <th>Country</th>
              <th>Telegram</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((row, i) => (
              <tr key={i}>
                <td>{row.created_at}</td>
                <td>{row.name}</td>
                <td>{row.company || "—"}</td>
                <td>{row.contact}</td>
                <td>{row.locale}</td>
                <td>{row.country || "—"}</td>
                <td>{row.telegram_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
