"use client";

import { useRef, useState } from "react";
import { PhotoCropper } from "@/components/ui/PhotoCropper";
import { ZoomablePhoto } from "@/components/ui/ZoomablePhoto";
import { api } from "@/lib/api";

interface MyPhotoProps {
  code: string;
  token: string;
  name: string;
  photo: string | null;
  emoji?: string | null;
  size?: "sm" | "md" | "lg";
  action?: boolean;
  onChanged: () => void;
}

export function MyPhoto({
  code,
  token,
  name,
  photo,
  emoji = null,
  size = "md",
  action = false,
  onChanged,
}: MyPhotoProps) {
  const file = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const pickFile = () => {
    setProblem(null);
    file.current?.click();
  };

  const send = async (photoBlob: Blob) => {
    setBusy(true);
    setProblem(null);

    try {
      await api.setPhoto(code, token, photoBlob);
      setChosen(null);
      onChanged();
    } catch (cause) {
      setProblem(
        cause instanceof Error ? cause.message : "Não consegui guardar essa foto. Tente de novo.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <ZoomablePhoto
        name={name}
        photo={photo}
        emoji={emoji}
        size={size}
        canEdit
        busy={busy}
        onEdit={pickFile}
      />

      <input
        ref={file}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const picked = event.target.files?.[0];

          event.target.value = "";

          if (!picked) {
            return;
          }

          setProblem(null);
          setChosen(picked);
        }}
      />

      {action ? (
        <button
          type="button"
          disabled={busy}
          onClick={pickFile}
          className="display cursor-pointer rounded-lg border-2 border-ink bg-sun px-2.5 py-1 text-[0.65rem] text-ink disabled:opacity-50"
        >
          {busy ? "Um instante" : photo ? "Trocar a foto" : "Pôr uma foto"}
        </button>
      ) : null}

      {problem ? (
        <p
          role="alert"
          className="max-w-[14rem] rounded-lg bg-magenta px-2 py-1 text-center text-[0.7rem] font-semibold text-cream"
        >
          {problem}
        </p>
      ) : null}

      {chosen ? (
        <PhotoCropper
          file={chosen}
          busy={busy}
          onCancel={() => setChosen(null)}
          onDone={(cropped) => void send(cropped)}
        />
      ) : null}
    </div>
  );
}
