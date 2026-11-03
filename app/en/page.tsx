import HomePage from "@/components/HomePage";
import { getDictionary } from "@/lib/dictionary";
import { organizationJsonLd } from "@/lib/organizationJsonLd";

export default function Page() {
  const dict = getDictionary("en");
  const jsonLd = organizationJsonLd(dict, "en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomePage dict={dict} locale="en" />
    </>
  );
}
