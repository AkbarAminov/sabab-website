import { getCloudflareContext } from "@opennextjs/cloudflare";
import HomePage from "@/components/HomePage";
import { getDictionary } from "@/lib/dictionary";
import { organizationJsonLd } from "@/lib/organizationJsonLd";

export default async function Page() {
  const dict = getDictionary("uz");
  const jsonLd = organizationJsonLd(dict, "uz");
  const { env } = await getCloudflareContext({ async: true });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomePage dict={dict} locale="uz" turnstileSiteKey={env.TURNSTILE_SITE_KEY} />
    </>
  );
}
