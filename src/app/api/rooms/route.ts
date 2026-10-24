import { handle } from "@/app/api/_shared";
import { createRoom } from "@/lib/game/service";
import { looksLikeRobot } from "@/lib/game/testDetection";
import type { DeckKind } from "@/types/track";

const decks: DeckKind[] = ["NATIONAL", "INTERNATIONAL", "MIXED"];
const modes = ["CLASSIC", "LIGHTNING"] as const;

export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json();
    const deck = decks.includes(body.deck) ? (body.deck as DeckKind) : "MIXED";
    const mode = modes.includes(body.mode) ? (body.mode as (typeof modes)[number]) : "CLASSIC";

    return createRoom({
      hostName: String(body.hostName ?? ""),
      deck,
      mode,
      isTest: looksLikeRobot(request),
    });
  });
}
