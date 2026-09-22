import { handle, playerToken } from "@/app/api/_shared";
import { faces } from "@/data/faces";
import { ServiceError, loadRoomForChat } from "@/lib/game/service";
import { serverClient } from "@/lib/supabase/server";

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  return handle(async () => {
    const { code } = await context.params;
    const { player } = await loadRoomForChat(code, playerToken(request));
    const body = (await request.json()) as { emoji?: string };

    if (!body.emoji || !faces.includes(body.emoji)) {
      throw new ServiceError("Escolha um dos bichinhos da lista", 422);
    }

    await serverClient()
      .from("vt_players")
      .update({ emoji: body.emoji, avatar: null })
      .eq("id", player.id);

    return { emoji: body.emoji };
  });
}
