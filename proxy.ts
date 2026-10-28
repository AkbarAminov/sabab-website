import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function parseBasicAuthPassword(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(":");
    return separatorIndex === -1 ? null : decoded.slice(separatorIndex + 1);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  // www is a separate Custom Domain pointed at the same Worker — redirect it
  // to the apex instead of silently serving a duplicate copy of the site.
  if (request.nextUrl.hostname === "www.sababbranding.com") {
    const url = new URL(request.url);
    url.hostname = "sababbranding.com";
    return NextResponse.redirect(url, 301);
  }

  // Gates /stats behind a single shared password (the username portion of
  // Basic Auth is ignored) — good enough for an internal, low-stakes counter
  // page. The real password lives in the STATS_PASSWORD secret; see README.
  if (request.nextUrl.pathname === "/stats") {
    const { env } = await getCloudflareContext({ async: true });
    const password = parseBasicAuthPassword(request.headers.get("authorization"));

    if (password !== env.STATS_PASSWORD) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="stats"' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
