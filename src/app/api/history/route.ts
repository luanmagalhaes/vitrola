import { handle } from "@/app/api/_shared";
import { closeStaleMatches } from "@/lib/game/service";
import { serverClient } from "@/lib/supabase/server";
import type { MatchRow } from "@/types/history";

export async function GET() {
  return handle(async () => {
    await closeStaleMatches();

    const { data } = await serverClient()
      .from("vt_matches")
      .select("*")
      .order("finished_at", { ascending: false })
      .limit(120);

    return { matches: (data as MatchRow[] | null) ?? [] };
  });
}
