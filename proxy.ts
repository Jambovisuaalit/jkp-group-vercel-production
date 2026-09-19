import { NextResponse, type NextRequest } from "next/server";

/** Make the response HTML root language match the EN route on the server. */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-jkp-locale", "en");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ["/en", "/en/:path*"] };
