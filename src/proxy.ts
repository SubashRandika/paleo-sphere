import { NextResponse, type NextRequest } from "next/server";
import { speciesRecords } from "@/content/species";

/**
 * Real 404 status for unknown species.
 *
 * Species pages stream (Partial Prerendering), and a streamed response has already
 * sent "200 OK" by the time the page can call notFound(). Checking the slug here,
 * before rendering starts, lets search engines see a true 404.
 * See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md#status-codes
 *
 * Only slugs are read (no validation) to keep Proxy fast.
 */
const knownSlugs = new Set(speciesRecords.map((s) => s.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !knownSlugs.has(slug)) {
    // Rewrite to a path no route matches: Next renders app/not-found.tsx with status 404,
    // while the visitor's address bar keeps the URL they typed.
    return NextResponse.rewrite(new URL("/_unknown-species", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/species/:slug",
};
