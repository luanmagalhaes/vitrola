"use client";

import { useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

interface PhotoViewerProps {
  name: string;
  photo: string | null;
  emoji?: string | null;
  canEdit?: boolean;
  busy?: boolean;
  onEdit?: () => void;
  onClose: () => void;
}

function editLabelFor(photo: string | null): string {
  return photo ? "Trocar a foto" : "Pôr uma foto";
}

function frameClassFor(photo: string | null): string {
  return photo ? "w-full p-1.5" : "flex items-center justify-center p-4";
}

export function PhotoViewer({
  name,
  photo,
  emoji = null,
  canEdit = false,
  busy = false,
  onEdit,
  onClose,
}: PhotoViewerProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto de ${name}`}
      onClick={onClose}
      className="animate-veil-in photo-veil fixed inset-0 z-[64] flex flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(var(--safe-bottom)+1.5rem)] pt-[calc(var(--safe-top)+1.5rem)]"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-photo-pop m-auto flex w-full max-w-xs shrink-0 flex-col items-center gap-3"
      >
        <span
          className={`overflow-hidden rounded-[1.75rem] border-4 border-ink bg-paper shadow-[0_14px_0_var(--color-ink)] ${frameClassFor(photo)}`}
        >
          {photo ? (
            <img
              src={photo}
              alt={`Foto de ${name}`}
              className="block max-h-[58dvh] w-full rounded-[1.25rem] object-contain"
            />
          ) : (
            <Avatar name={name} photo={null} emoji={emoji} size="xl" />
          )}
        </span>

        <span className="display rounded-xl border-2 border-ink bg-paper px-4 py-1.5 text-center text-lg leading-tight text-ink">
          {name}
        </span>

        {canEdit ? (
          <>
            <Button variant="aqua" fullWidth disabled={busy} onClick={onEdit}>
              {busy ? "Um instante..." : editLabelFor(photo)}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="display inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 text-xs text-cream/70 transition-colors hover:text-cream"
            >
              Fechar
            </button>
          </>
        ) : (
          <span className="text-xs font-semibold text-cream/70">Toque para fechar</span>
        )}
      </div>
    </div>
  );
}
