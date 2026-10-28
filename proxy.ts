import { type NextRequest, NextResponse } from "next/server";
import { isDownloadRedirectHost } from "@/lib/marketing";

// download.newbeeapp.com (and legacy marketing.newbeeapp.com) is printed on
// Instagram story footers and store material, so its bare root (/) must keep
// rewriting to the device-aware /download redirect.
// On newbeeapp.com, www.newbeeapp.com, and preview hosts, / serves the website.
export function proxy(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.hostname;

  if (isDownloadRedirectHost(rawHost)) {
    return NextResponse.rewrite(new URL("/download", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
