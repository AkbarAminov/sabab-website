import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Locale } from "./dictionary";

export type PdfKind = "portfolio" | "services";

// PDFs live in R2 (bucket sabab-files, binding FILES) rather than in the
// repo, so they're only reachable through these route handlers — never as a
// static URL — and a missing object falls through to /soon instead of
// silently serving nothing. See README "Cloudflare" for how to upload them.
export async function servePdf(kind: PdfKind, locale: Locale, request: Request): Promise<Response> {
  const { env, ctx } = await getCloudflareContext({ async: true });

  // R2 isn't bound yet (e.g. the bucket hasn't been created/enabled on this
  // account) — fail open to /soon instead of a 500.
  if (!env.FILES) {
    return Response.redirect(new URL(`/soon?locale=${locale}`, request.url), 307);
  }

  let key = `${kind}-${locale}.pdf`;
  let object = await env.FILES.get(key);

  // Fall back to the Russian file until a localized version is uploaded.
  if (!object && locale !== "ru") {
    key = `${kind}-ru.pdf`;
    object = await env.FILES.get(key);
  }

  if (!object) {
    return Response.redirect(new URL(`/soon?locale=${locale}`, request.url), 307);
  }

  // Logged after the file is confirmed to exist — a /soon redirect isn't a
  // real "open". Runs via waitUntil so the insert can't delay the response.
  ctx.waitUntil(
    env.DB.prepare("INSERT INTO opens (file, locale, country) VALUES (?1, ?2, ?3)")
      .bind(kind, locale, request.headers.get("cf-ipcountry") ?? "unknown")
      .run(),
  );

  return new Response(object.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${key}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
