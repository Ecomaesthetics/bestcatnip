import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("email_subscribers")
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    if (error.code === "23505") {
      // unique violation — already subscribed, treat as success
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Could not save your email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
