import type { Brand, Device, Finding, SectionType, Wireframe, WireframeSection } from '../lib/api';

interface Props {
  wireframe: Wireframe;
  brand: Brand;
  device: Device;
  analyzedUrl: string;
  findings: Finding[];
  activeSection: SectionType | 'general' | null;
  onHover: (section: SectionType | 'general' | null) => void;
  onSelect: (section: SectionType | 'general') => void;
}

const SECTION_LABEL: Record<SectionType, string> = {
  nav: 'Navegación',
  hero: 'Hero',
  features: 'Features',
  'social-proof': 'Prueba social',
  cta: 'Llamado a la acción',
  footer: 'Footer',
};

function initials(url: string) {
  const clean = url.replace(/^www\./, '').split('.')[0];
  return clean.slice(0, 2).toUpperCase();
}

export default function WireframePanel({ wireframe, brand, device, analyzedUrl, findings, activeSection, onHover, onSelect }: Props) {
  const color = brand.primaryColor || '#6366f1';

  return (
    <div>
      <div className="mb-3.5 text-[11px] uppercase tracking-[0.2em] text-white/40">Wireframe · versión mejorada</div>

      <div className={`mx-auto ${device === 'mobile' ? 'max-w-[340px]' : 'max-w-full'}`}>
        <div className="overflow-hidden rounded-[18px] border border-white/[0.14] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
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

          <div className="flex flex-col bg-[#0c0c0e]">
            {wireframe.sections.map((section, i) => {
              const ids = findings.filter((f) => f.section === section.type).map((f) => f.id);
              const on = activeSection === section.type;
              const dim = activeSection != null && !on;
              return (
                <div
                  key={`${section.type}-${i}`}
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => onHover(section.type)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(section.type)}
                  className="relative cursor-pointer transition-all duration-200"
                  style={{
                    outline: on ? `2px solid ${color}` : '2px solid transparent',
                    outlineOffset: '-2px',
                    opacity: dim ? 0.4 : 1,
                    background: on ? 'rgba(255,255,255,0.03)' : 'transparent',
                  }}
                >
                  <span className="pointer-events-none absolute right-2 top-1 z-[2] text-[9px] uppercase tracking-[0.14em] text-white/25">
                    {SECTION_LABEL[section.type]}
                  </span>
                  {ids.map((id, bi) => (
                    <div
                      key={id}
                      className="absolute z-[3] flex h-[24px] w-[24px] items-center justify-center rounded-full text-[12px] font-bold leading-none shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-colors"
                      style={{
                        top: -9,
                        left: -9 + bi * 22,
                        background: on ? color : '#fff',
                        color: on ? '#fff' : '#1a1a1e',
                        border: `2px solid ${on ? '#fff' : '#1a1a1e'}`,
                      }}
                    >
                      {id}
                    </div>
                  ))}
                  <SectionContent section={section} brand={brand} color={color} device={device} analyzedUrl={analyzedUrl} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mx-0.5 mt-3 text-center text-xs leading-relaxed text-white/40">
        Pasa el cursor (o toca) un hallazgo de la lista para resaltar la sección correspondiente del wireframe.
      </p>
    </div>
  );
}

function SectionContent({
  section,
  brand,
  color,
  device,
  analyzedUrl,
}: {
  section: WireframeSection;
  brand: Brand;
  color: string;
  device: Device;
  analyzedUrl: string;
}) {
  const mobile = device === 'mobile';

  if (section.type === 'nav') {
    return (
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt="" className="h-6 w-6 rounded object-contain" />
          ) : (
            <span
              className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white"
              style={{ background: color }}
            >
              {initials(analyzedUrl)}
            </span>
          )}
          <span className="text-sm font-semibold text-white">{analyzedUrl.split('/')[0]}</span>
        </div>
        {!mobile && (
          <div className="flex items-center gap-5">
            {(section.links || []).map((l) => (
              <span key={l} className="text-xs text-white/50">
                {l}
              </span>
            ))}
          </div>
        )}
        {section.primaryCta && (
          <span className="rounded-full px-4 py-1.5 text-xs font-semibold text-white" style={{ background: color }}>
            {section.primaryCta}
          </span>
        )}
      </div>
    );
  }

  if (section.type === 'hero') {
    return (
      <div className={`flex flex-col items-center gap-3 px-6 py-10 text-center ${mobile ? '' : 'py-14'}`}>
        {section.eyebrow && (
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color }}>
            {section.eyebrow}
          </span>
        )}
        <h3 className={`font-serif text-white ${mobile ? 'text-2xl' : 'text-4xl'} max-w-2xl leading-tight`}>{section.headline}</h3>
        {section.subheadline && <p className="max-w-lg text-sm leading-relaxed text-white/55">{section.subheadline}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {section.primaryCta && (
            <span className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: color }}>
              {section.primaryCta}
            </span>
          )}
          {section.secondaryCta && (
            <span className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/80">
              {section.secondaryCta}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (section.type === 'features') {
    return (
      <div className="px-6 py-8">
        <div className={`grid gap-3 ${mobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {(section.items || []).map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                <span className="text-sm font-semibold text-white">{item.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-white/50">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'social-proof') {
    return (
      <div className="flex flex-col gap-2.5 px-6 py-8">
        {(section.proofItems || []).map((item) => (
          <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-white/60">
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'cta') {
    return (
      <div
        className="flex flex-col items-center gap-4 px-6 py-10 text-center"
        style={{ background: `linear-gradient(180deg, ${color}22, transparent)` }}
      >
        <h4 className={`font-serif text-white ${mobile ? 'text-xl' : 'text-2xl'} max-w-md`}>{section.headline}</h4>
        {section.primaryCta && (
          <span className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white" style={{ background: color }}>
            {section.primaryCta}
          </span>
        )}
      </div>
    );
  }

  return <div className="px-6 py-5 text-center text-[11px] text-white/35">{section.footerText}</div>;
}
