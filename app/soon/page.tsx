import styles from "./page.module.css";
import interactive from "@/components/interactive.module.css";
import { getDictionary, type Locale } from "@/lib/dictionary";
import { ALL_LOCALES, homeHref } from "@/lib/links";

function resolveLocale(value: string | string[] | undefined): Locale {
  const candidate = Array.isArray(value) ? value[0] : value;
  return (ALL_LOCALES as string[]).includes(candidate ?? "")
    ? (candidate as Locale)
    : "ru";
}

export default async function SoonPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string | string[] }>;
}) {
  const locale = resolveLocale((await searchParams).locale);
  const dict = getDictionary(locale);

  return (
    <main className={styles.page}>
      <div>
        <h1 className={styles.title}>{dict.soon.title}</h1>
        <p className={styles.body}>{dict.soon.body}</p>
        <a href={homeHref(locale)} className={interactive.link}>
          {dict.soon.backHome}
        </a>
      </div>
    </main>
  );
}
