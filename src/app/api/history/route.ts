import { handle } from "@/app/api/_shared";
import { serverClient } from "@/lib/supabase/server";
import type { MatchRow } from "@/types/history";

export async function GET() {
  return handle(async () => {
    const { data } = await serverClient()
      .from("vt_matches")
      .select("*")
      .order("finished_at", { ascending: false })
      .limit(120);

    return { matches: (data as MatchRow[] | null) ?? [] };
  });
}
