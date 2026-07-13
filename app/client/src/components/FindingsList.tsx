import type { Finding, SectionType } from '../lib/api';
import { SEVERITY_LABEL, severityBadgeClass } from '../lib/format';

interface Props {
  findings: Finding[];
  activeSection: SectionType | 'general' | null;
  onHover: (section: SectionType | 'general' | null) => void;
  onSelect: (section: SectionType | 'general') => void;
}

export default function FindingsList({ findings, activeSection, onHover, onSelect }: Props) {
  return (
    <div>
      <div className="mb-3.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
        Recomendaciones ({findings.length})
      </div>
      <div className="flex flex-col gap-3">
        {findings.map((f) => {
          const on = activeSection === f.section && f.section !== 'general';
          return (
            <div
              key={f.id}
              role="button"
              tabIndex={0}
              onMouseEnter={() => onHover(f.section)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(f.section)}
              className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border px-4.5 py-4 transition-all ${
                on
                  ? 'border-white/28 bg-white/[0.09] shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                  : 'border-white/[0.09] bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
              }`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                  on ? 'border-2 border-white bg-white text-black' : 'border border-white/20 bg-white/[0.08] text-white/80'
                }`}
              >
                {f.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <span className="text-[15px] font-semibold text-white">{f.title}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${severityBadgeClass(f.severity)}`}>
                    {SEVERITY_LABEL[f.severity]}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/35">{f.category}</span>
                </div>
                <div className="text-[13.5px] leading-relaxed text-white/60">{f.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
