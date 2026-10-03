import { NextResponse } from "next/server";

// Retire the whole wedding feature, including POST requests to its server actions.
export function middleware() {
  return new NextResponse("Page not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/marriage/:path*", "/marriages/:path*"],
};
