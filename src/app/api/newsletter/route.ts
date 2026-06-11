import { NextResponse } from "next/server";
import { MAILCHIMP_AUDIENCE_ID, NEWSLETTER_PROVIDER } from "@/lib/mailchimp";

type NewsletterBody = {
  email?: string;
};

async function subscribeMailchimp(email: string): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    throw new Error("Mailchimp is not configured");
  }

  const dc = apiKey.split("-").pop();
  if (!dc) throw new Error("Invalid Mailchimp API key format");

  const res = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `apikey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        tags: ["vamos26", "wc26"],
      }),
    }
  );

  if (res.status === 400) {
    const data = (await res.json()) as { title?: string };
    if (data.title === "Member Exists") return;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mailchimp error: ${text}`);
  }
}

async function subscribeConvertKit(email: string): Promise<void> {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) {
    throw new Error("ConvertKit is not configured");
  }

  const res = await fetch(
    `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, email }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ConvertKit error: ${text}`);
  }
}

export async function POST(request: Request) {
  let body: NewsletterBody;
  try {
    body = (await request.json()) as NewsletterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const provider = NEWSLETTER_PROVIDER;

  try {
    if (provider === "convertkit") {
      await subscribeConvertKit(email);
    } else {
      await subscribeMailchimp(email);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Subscribe failed";

    if (message.includes("not configured")) {
      return NextResponse.json(
        {
          error:
            "Newsletter provider not configured. Add Mailchimp or ConvertKit env vars in Vercel.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Could not subscribe" }, { status: 502 });
  }
}
