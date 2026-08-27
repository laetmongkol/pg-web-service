import { revalidateTag } from "next/cache";

import type { NextRequest } from "next/server";

// Backend calls this on blog publish/unpublish to bust the sitemap (and blog) cache
// immediately instead of waiting for the 1h ISR window. Gated by REVALIDATE_SECRET.
export async function POST(request: NextRequest): Promise<Response> {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
        return new Response("Unauthorized", { status: 401 });
    }

    const tag = new URL(request.url).searchParams.get("tag") ?? "blogs:sitemap";
    revalidateTag(tag, "max");

    return Response.json({ revalidated: true, tag });
}
