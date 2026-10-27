import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import type { Locale } from "./dictionary";

export type PdfKind = "portfolio" | "services";

// PDFs live outside /public so they're only reachable through these route
// handlers (never as a static /files/* URL), and so a missing file 404s
// instead of silently serving nothing.
const FILES_DIR = path.join(process.cwd(), "files");

export async function servePdf(kind: PdfKind, locale: Locale): Promise<Response> {
  let filename = `${kind}-${locale}.pdf`;
  let filePath = path.join(FILES_DIR, filename);

  // Fall back to the Russian file if a localized one hasn't been supplied yet.
  if (locale !== "ru" && !existsSync(filePath)) {
    filename = `${kind}-ru.pdf`;
    filePath = path.join(FILES_DIR, filename);
  }

  if (!existsSync(filePath)) {
    return new Response(
      `PDF not found. Place the file at /files/${kind}-ru.pdf (and optionally /files/${kind}-en.pdf).`,
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const data = await readFile(filePath);
  const body = new Uint8Array(data);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
