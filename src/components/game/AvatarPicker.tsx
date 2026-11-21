"use client";

import { useState } from "react";
import { MyPhoto } from "@/components/game/MyPhoto";
import { faces } from "@/data/faces";
import { api } from "@/lib/api";
import type { PlayerRow } from "@/types/room";

export function AvatarPicker({
  code,
  token,
  me,
  onDone,
}: {
  code: string;
  token: string;
  me: PlayerRow;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const chooseFace = async (face: string) => {
    if (busy) {
      return;
    }

    setBusy(true);
    setProblem(null);

    try {
      await api.setEmoji(code, token, face);
      onDone();
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "Não consegui trocar o bichinho.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-ink bg-paper p-3">
      <div className="flex items-center gap-3">
        <MyPhoto
          code={code}
          token={token}
          name={me.name}
          photo={me.avatar}
          emoji={me.emoji}
          size="lg"
          action
          onChanged={onDone}
        />
        <div className="min-w-0 flex-1">
          <p className="display text-ink">Sua cara</p>
          <p className="text-xs font-semibold text-ink/60">
            Toque na sua cara para mandar uma foto, ou escolha um bichinho aqui embaixo.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-8 gap-1">
        {faces.map((face) => (
          <button
            key={face}
            type="button"
            disabled={busy}
            aria-label={`Usar ${face}`}
            aria-pressed={me.emoji === face}
            onClick={() => void chooseFace(face)}
            className={`cursor-pointer rounded-lg border-2 py-1 text-xl disabled:opacity-50 ${
              me.emoji === face ? "border-ink bg-sun" : "border-transparent bg-cream"
            }`}
          >
            {face}
          </button>
        ))}
      </div>

      {problem ? (
        <p
          role="alert"
          className="mt-2 rounded-lg bg-magenta px-2 py-1 text-center text-[0.7rem] font-semibold text-cream"
        >
          {problem}
        </p>
      ) : null}
    </div>
  );
}
