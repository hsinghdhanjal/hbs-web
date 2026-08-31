import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Hit daily by Vercel Cron (see vercel.json) to keep the Supabase free-tier
// project from auto-pausing after 7 days of inactivity. A real database
// read counts as project activity, unlike a plain page request.
export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("consultations").select("id").limit(1);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Ping failed." },
      { status: 500 },
    );
  }
}
