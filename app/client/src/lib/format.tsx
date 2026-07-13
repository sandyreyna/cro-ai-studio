import type { Severity } from './api';

export function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="italic text-white/95">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  alta: 'Alto impacto',
  media: 'Impacto medio',
  baja: 'Impacto bajo',
};

export function severityBadgeClass(sev: Severity) {
  if (sev === 'alta') return 'bg-white/90 text-black';
  if (sev === 'media') return 'bg-white/15 text-white/85 border border-white/20';
  return 'bg-transparent text-white/50 border border-white/15';
}
