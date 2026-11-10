import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ALL_LOCALES } from "@/lib/links";
import type { Locale } from "@/lib/dictionary";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
// Counts every attempt, valid or not, so a few mis-clicks while testing the
// form shouldn't eat the same budget as actual spam — 5 is still a hard
// stop for anything scripted.
const RATE_LIMIT_MAX = 5;
const MAX_FIELD_LENGTH = 200;

interface LeadPayload {
  name?: unknown;
  company?: unknown;
  contact?: unknown;
  locale?: unknown;
  consent?: unknown;
  honeypot?: unknown;
  turnstileToken?: unknown;
}

function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (ch) => `\\${ch}`);
}

async function verifyTurnstile(secretKey: string, token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function notifyTelegram(
  env: CloudflareEnv,
  leadId: number,
  fields: { name: string; company: string; contact: string; locale: Locale; country: string },
): Promise<"sent" | "failed"> {
  const lines = [
    `*Новая заявка* \\(${escapeMarkdownV2(fields.locale.toUpperCase())}\\)`,
    `*Имя:* ${escapeMarkdownV2(fields.name)}`,
    fields.company ? `*Компания:* ${escapeMarkdownV2(fields.company)}` : null,
    `*Контакт:* ${escapeMarkdownV2(fields.contact)}`,
    `*Страна:* ${escapeMarkdownV2(fields.country)}`,
  ].filter((line): line is string => Boolean(line));

  try {
    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: lines.join("\n"),
        parse_mode: "MarkdownV2",
      }),
    });
    const data = (await res.json()) as { ok?: boolean };
    return res.ok && data.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(request: Request) {
  const { env, ctx } = await getCloudflareContext({ async: true });

  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const country = request.headers.get("cf-ipcountry") ?? "unknown";

  // Honeypot: a real visitor never fills this hidden field. Drop silently —
  // no DB row, no Telegram send — but still report success so a bot gets no
  // signal that it was caught.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return Response.json({ ok: true });
  }

  // Rate limit: record this attempt, then count the window — counts toward
  // the limit whether or not the request ultimately validates, so repeated
  // invalid attempts from one IP still get throttled.
  await env.DB.prepare("INSERT INTO lead_rate_limit (ip) VALUES (?1)").bind(ip).run();
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { results: rateRows } = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM lead_rate_limit WHERE ip = ?1 AND created_at > ?2",
  )
    .bind(ip, cutoff)
    .all<{ count: number }>();
  if ((rateRows[0]?.count ?? 0) > RATE_LIMIT_MAX) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const locale = typeof body.locale === "string" ? body.locale : "";

  const valid =
    name.length > 0 &&
    name.length <= MAX_FIELD_LENGTH &&
    contact.length > 0 &&
    contact.length <= MAX_FIELD_LENGTH &&
    company.length <= MAX_FIELD_LENGTH &&
    (ALL_LOCALES as string[]).includes(locale) &&
    body.consent === true;

  if (!valid) {
    return Response.json({ error: "validation" }, { status: 400 });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const passed = token !== "" && (await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip));
    if (!passed) {
      return Response.json({ error: "turnstile" }, { status: 400 });
    }
  }

  const insert = await env.DB.prepare(
    "INSERT INTO leads (name, company, contact, locale, country, telegram_status) VALUES (?1, ?2, ?3, ?4, ?5, 'pending')",
  )
    .bind(name, company || null, contact, locale, country)
    .run();
  const leadId = insert.meta.last_row_id;

  // The lead is already saved at this point, so the client gets success
  // regardless of how the Telegram notification goes — fire it in the
  // background via waitUntil rather than making the response wait on it.
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    ctx.waitUntil(
      notifyTelegram(env, leadId, { name, company, contact, locale: locale as Locale, country }).then(
        (status) =>
          env.DB.prepare("UPDATE leads SET telegram_status = ?1 WHERE id = ?2").bind(status, leadId).run(),
      ),
    );
  } else {
    ctx.waitUntil(
      env.DB.prepare("UPDATE leads SET telegram_status = 'skipped' WHERE id = ?1").bind(leadId).run(),
    );
  }

  return Response.json({ ok: true });
}
