/**
 * Calls the Assignment 5 caption API. Configure the exact URL and auth in Vercel env.
 *
 * ALMOSTCRACKD_GENERATE_CAPTIONS_URL — full URL to the endpoint (required)
 * ALMOSTCRACKD_GENERATE_CAPTIONS_METHOD — HTTP method, default POST
 * ALMOSTCRACKD_API_KEY — optional static Bearer token
 * ALMOSTCRACKD_FORWARD_SUPABASE_TOKEN — set to "1" to send the signed-in user's JWT instead
 */

export type AlmostCrackdCaptionResult = {
  status: number;
  body: unknown;
};

export async function generateCaptionsWithAlmostCrackd(input: {
  imageUrl: string;
  humorFlavorId: string;
  accessToken?: string | null;
}): Promise<AlmostCrackdCaptionResult> {
  const url = process.env.ALMOSTCRACKD_GENERATE_CAPTIONS_URL?.trim();
  if (!url) {
    throw new Error(
      "Set ALMOSTCRACKD_GENERATE_CAPTIONS_URL to the full caption endpoint URL from Assignment 5."
    );
  }

  const method = (
    process.env.ALMOSTCRACKD_GENERATE_CAPTIONS_METHOD ?? "POST"
  ).toUpperCase();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const apiKey = process.env.ALMOSTCRACKD_API_KEY?.trim();
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else if (
    process.env.ALMOSTCRACKD_FORWARD_SUPABASE_TOKEN === "1" &&
    input.accessToken
  ) {
    headers.Authorization = `Bearer ${input.accessToken}`;
  }

  const payload = {
    image_url: input.imageUrl,
    humor_flavor_id: input.humorFlavorId,
    imageUrl: input.imageUrl,
    humorFlavorId: input.humorFlavorId,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    /* keep raw text */
  }

  return { status: res.status, body };
}
