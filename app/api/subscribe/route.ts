import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const token  = process.env.SENDFOX_API_TOKEN;
  const listId = process.env.SENDFOX_LIST_ID;

  if (!token || !listId) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const res = await fetch("https://api.sendfox.com/contacts", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      lists: [Number(listId)],
    }),
  });

  // 200 = created, 422 = already exists — both are fine
  if (res.ok || res.status === 422) {
    return NextResponse.json({ ok: true });
  }

  const err = await res.json().catch(() => ({}));
  return NextResponse.json(
    { error: (err as { message?: string }).message ?? "Could not subscribe. Please try again." },
    { status: 500 }
  );
}
