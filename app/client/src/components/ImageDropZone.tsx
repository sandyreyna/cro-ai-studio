import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Check } from 'lucide-react';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;

interface Props {
  hasImage: boolean;
  imageName?: string;
  onFile: (file: File) => void;
  onError: (message: string) => void;
}

export default function ImageDropZone({ hasImage, imageName, onFile, onError }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  function validateAndEmit(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      onError('Ese archivo no es una imagen soportada. Usa PNG, JPG o WEBP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      onError('La imagen pesa demasiado (máximo 8MB). Prueba con una captura más liviana.');
      return;
    }
    onFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    validateAndEmit(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border border-dashed px-5 py-4 text-left transition-colors ${
        dragging ? 'border-white/40 bg-white/10' : 'border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.07]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] border border-white/10 bg-white/[0.06]">
        <ImagePlus size={20} className="text-white/70" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[10px] uppercase tracking-[0.18em] text-white/40">Opcional</div>
        <div className="truncate text-sm leading-snug text-white/65">
          {hasImage
            ? `Captura adjunta${imageName ? ` — ${imageName}` : ''}: se generará el anotado visual`
            : 'Sube una captura de tu landing para el análisis visual anotado'}
        </div>
      </div>
      {hasImage && <Check size={20} className="flex-shrink-0 text-white" strokeWidth={2.2} />}
    </div>
  );
}
