import { handle } from "@/app/api/_shared";
import { closeStaleMatches } from "@/lib/game/service";
import { joinRoom } from "@/lib/game/service";

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  return handle(async () => {
    await closeStaleMatches();

    const { code } = await context.params;
    const body = await request.json();

    return joinRoom({ code, name: String(body.name ?? "") });
  });
}
