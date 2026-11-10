import { getCloudflareContext } from "@opennextjs/cloudflare";
import HomePage from "@/components/HomePage";
import { getDictionary } from "@/lib/dictionary";
import { organizationJsonLd } from "@/lib/organizationJsonLd";

export default async function Page() {
  const dict = getDictionary("ru");
  const jsonLd = organizationJsonLd(dict, "ru");
  // Not secret — the Turnstile "site key" is meant to be public. Read at
  // request time (same pattern as lib/pdf.ts) instead of baked in at build,
  // and simply absent in environments where it hasn't been configured yet
  // (LeadPopup degrades gracefully, see components/LeadPopup/LeadPopup.tsx).
  const { env } = await getCloudflareContext({ async: true });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomePage dict={dict} locale="ru" turnstileSiteKey={env.TURNSTILE_SITE_KEY} />
    </>
  );
}
