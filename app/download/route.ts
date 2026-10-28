/**
 * GET /download
 *
 * Smart download link — redirects to the correct store based on device:
 *   - iOS/iPad  → App Store
 *   - Android   → Google Play Store
 *   - Desktop   → app.newbeeapp.com
 */

import { NextResponse } from "next/server";
import { getDownloadRedirectUrl } from "@/lib/marketing";

export function GET(req: Request) {
  const targetUrl = getDownloadRedirectUrl(req.headers.get("user-agent"));
  return NextResponse.redirect(targetUrl, 302);
}
