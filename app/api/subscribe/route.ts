import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const normalised = email.toLowerCase().trim();

  // Try SendFox first if credentials are configured
  const token  = process.env.SENDFOX_API_TOKEN;
  const listId = process.env.SENDFOX_LIST_ID;

  if (token && listId) {
    try {
      const sfRes = await fetch("https://api.sendfox.com/contacts", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email: normalised, lists: [Number(listId)] }),
        signal: AbortSignal.timeout(10000),
      });

      // 200 created, 422 already exists — both are fine
      if (sfRes.ok || sfRes.status === 422) {
        return NextResponse.json({ ok: true });
      }
    } catch {
      // SendFox unavailable — fall through to Supabase backup
    }
  }

  // Fallback: save to Supabase email_subscribers table
  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from("email_subscribers")
      .insert({ email: normalised });

    if (error && error.code !== "23505") {
      // 23505 = unique violation (already subscribed) — treat as success
      throw error;
    }
  } catch {
    return NextResponse.json(
      { error: "Could not subscribe. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
