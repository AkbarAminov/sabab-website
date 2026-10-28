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

export default async function StatsPage() {
  const { env } = await getCloudflareContext({ async: true });

  const [summary, recent] = await Promise.all([
    env.DB.prepare(
      "SELECT file, locale, country, COUNT(*) AS count FROM opens GROUP BY file, locale, country ORDER BY count DESC",
    )
      .all<SummaryRow>()
      .then((r) => r.results),
    env.DB.prepare("SELECT opened_at, file, locale, country FROM opens ORDER BY opened_at DESC LIMIT 50")
      .all<OpenRow>()
      .then((r) => r.results),
  ]);

  const total = summary.reduce((sum, row) => sum + row.count, 0);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>PDF opens — {total} total</h1>

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
    </main>
  );
}
