import { createSiteIconResponse } from "@/app/icon-response";

export const runtime = "edge";

export async function GET() {
  return createSiteIconResponse(120);
}
