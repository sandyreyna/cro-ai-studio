import { useRef, useState, type DragEvent } from 'react';
import { Loader2, ImagePlus } from 'lucide-react';
import type { Device, Finding } from '../lib/api';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;

interface Props {
  imageUrl: string | null;
  analyzedUrl: string;
  device: Device;
  visualFindings: Finding[];
  activeId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number) => void;
  onFile: (file: File) => void;
  onError: (message: string) => void;
  analyzing: boolean;
}

export default function AnnotatedPanel({
  imageUrl,
  analyzedUrl,
  device,
  visualFindings,
  activeId,
  onHover,
  onSelect,
  onFile,
  onError,
  analyzing,
}: Props) {
  return (
    <div>
      <div className="mb-3.5 text-[11px] uppercase tracking-[0.2em] text-white/40">Nivel 2 · Anotado visual</div>

      {imageUrl ? (
        <>
          <div className={`mx-auto ${device === 'mobile' ? 'max-w-[300px]' : 'max-w-full'}`}>
            <div className="relative overflow-hidden rounded-[18px] border border-white/[0.14] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              {device === 'desktop' ? (
                <div className="flex items-center gap-2 bg-[#26262b] px-3.5 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
                    <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
                    <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
                  </div>
                  <div className="ml-2 flex-1 truncate rounded-[7px] bg-[#1a1a1e] px-3 py-1 text-[11px] text-[#8a8a92]">
                    {analyzedUrl || 'tulandingpage.com'}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 bg-[#26262b] px-3.5 py-2">
                  <div className="truncate rounded-[7px] bg-[#1a1a1e] px-3 py-1 text-[11px] text-[#8a8a92]">
                    {analyzedUrl || 'tulandingpage.com'}
                  </div>
                </div>
              )}

              <div className="relative">
                <img src={imageUrl} alt="Captura de la landing analizada" className="block w-full" />

                {analyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-white backdrop-blur-sm">
                    <Loader2 size={26} className="animate-spin" />
                    <span className="text-xs text-white/80">Generando el anotado visual…</span>
                  </div>
                )}

                {visualFindings.map((f) => {
                  if (!f.box) return null;
                  const on = activeId === f.id;
                  const dim = activeId != null && !on;
                  return (
                    <div key={f.id} className="pointer-events-none absolute inset-0">
                      <div
                        onMouseEnter={() => onHover(f.id)}
                        onMouseLeave={() => onHover(null)}
                        onClick={() => onSelect(f.id)}
                        className="pointer-events-auto absolute cursor-pointer rounded-lg transition-all duration-200"
                        style={{
                          left: `${f.box.x}%`,
                          top: `${f.box.y}%`,
                          width: `${f.box.w}%`,
                          height: `${f.box.h}%`,
                          transform: on ? 'translate(-50%,-50%) scale(1.03)' : 'translate(-50%,-50%)',
                          border: on ? '2.5px solid #1a1a1e' : '2px solid rgba(26,26,30,0.45)',
                          background: on ? 'rgba(26,26,30,0.12)' : 'transparent',
                          boxShadow: on ? '0 0 0 4px rgba(255,255,255,0.6), 0 8px 24px rgba(0,0,0,0.25)' : 'none',
                          opacity: dim ? 0.22 : 1,
                        }}
                      />
                      <div
                        onMouseEnter={() => onHover(f.id)}
                        onMouseLeave={() => onHover(null)}
                        onClick={() => onSelect(f.id)}
                        className="pointer-events-auto absolute z-[3] flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full text-[13px] font-bold leading-none transition-all duration-200"
                        style={{
                          left: `${f.box.x - f.box.w / 2}%`,
                          top: `${f.box.y - f.box.h / 2}%`,
                          transform: 'translate(-50%,-50%)',
                          background: on ? '#1a1a1e' : '#fff',
                          color: on ? '#fff' : '#1a1a1e',
                          border: on ? '2px solid #fff' : '2px solid #1a1a1e',
                          boxShadow: on ? '0 0 0 4px rgba(26,26,30,0.25), 0 4px 14px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: dim ? 0.3 : 1,
                        }}
                      >
                        {f.id}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mx-0.5 mt-3 text-center text-xs leading-relaxed text-white/40">
            Pasa el cursor (o toca) un hallazgo de la lista para resaltar su marca sobre la captura.
          </p>
        </>
      ) : (
        <UnlockZone onFile={onFile} onError={onError} />
      )}
    </div>
  );
}

function UnlockZone({ onFile, onError }: { onFile: (f: File) => void; onError: (m: string) => void }) {
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
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        validateAndEmit(e.dataTransfer.files?.[0]);
      }}
      className={`cursor-pointer rounded-[18px] border border-dashed px-6 py-10 text-center transition-colors ${
        dragging ? 'border-white/35 bg-white/[0.07]' : 'border-white/20 bg-white/[0.03] hover:border-white/35 hover:bg-white/[0.07]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
      <div className="animate-floaty mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06]">
        <ImagePlus size={24} className="text-white/75" strokeWidth={1.7} />
      </div>
      <div className="mb-2 font-serif text-2xl text-white">Sube una captura</div>
      <div className="mx-auto max-w-[32ch] text-sm leading-relaxed text-white/55">
        Desbloquea el screenshot anotado: cada hallazgo marcado con cajas y números sobre tu imagen real.
      </div>
    </div>
  );
}
