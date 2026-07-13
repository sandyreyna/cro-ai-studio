import { motion } from 'framer-motion';
import { ScanSearch, RotateCcw } from 'lucide-react';
import type { AnalyzeResult, Finding } from '../lib/api';
import { renderEmphasis } from '../lib/format';
import ScoreRing from './ScoreRing';
import CategoryCards from './CategoryCards';
import AnnotatedPanel from './AnnotatedPanel';
import FindingsList from './FindingsList';

interface Props {
  result: AnalyzeResult;
  imageUrl: string | null;
  activeId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number) => void;
  onFile: (file: File) => void;
  onImageError: (message: string) => void;
  imageAnalyzing: boolean;
  imageError: string;
  onReset: () => void;
}

export default function ResultsScreen({
  result,
  imageUrl,
  activeId,
  onHover,
  onSelect,
  onFile,
  onImageError,
  imageAnalyzing,
  imageError,
  onReset,
}: Props) {
  const highCount = result.findings.filter((f) => f.severity === 'alta').length;
  const visualFindings: Finding[] = result.findings.filter((f) => f.source === 'visual');

  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          'radial-gradient(1200px 700px at 50% -10%, rgba(255,255,255,0.06), transparent 70%), #000',
      }}
    >
      <div className="sticky top-0 z-30 bg-gradient-to-b from-black/90 to-black/40 px-5 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <ScanSearch size={20} className="flex-shrink-0 text-white" strokeWidth={1.8} />
            <span className="flex-shrink-0 text-[15px] font-semibold text-white">CRO AI Studio</span>
            <span className="hidden text-white/35 sm:inline">·</span>
            <span className="hidden truncate text-[13px] text-white/55 sm:inline">{result.analyzedUrl}</span>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2.5">
            <span className="hidden rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 sm:inline-flex">
              {result.device === 'mobile' ? 'Versión móvil' : 'Versión escritorio'}
            </span>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] px-4 py-2 text-[13px] text-white transition-colors hover:bg-white/[0.12]"
            >
              <RotateCcw size={15} />
              Nuevo
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 pb-20 pt-3.5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-7 px-1 pb-2.5 pt-7"
        >
          <ScoreRing score={result.score} />
          <div className="min-w-[240px] flex-1">
            <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">Puntaje CRO</div>
            <h2 className="mb-3 font-serif text-[clamp(1.9rem,5vw,2.9rem)] font-normal leading-[1.08] tracking-tight text-white">
              {renderEmphasis(result.headline)}
            </h2>
            <p className="max-w-[50ch] text-[15px] leading-relaxed text-white/60">
              Encontramos <strong className="text-white">{result.findings.length} oportunidades</strong> de mejora.{' '}
              {highCount} son de alto impacto: resuélvelas primero para el mayor salto en conversión.
            </p>
          </div>
        </motion.div>

        <CategoryCards categories={result.categories} />

        {imageError && (
          <div className="mb-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs text-white/60">
            {imageError}
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <AnnotatedPanel
            imageUrl={imageUrl}
            analyzedUrl={result.analyzedUrl}
            device={result.device}
            visualFindings={visualFindings}
            activeId={activeId}
            onHover={onHover}
            onSelect={onSelect}
            onFile={onFile}
            onError={onImageError}
            analyzing={imageAnalyzing}
          />
          <FindingsList findings={result.findings} activeId={activeId} onHover={onHover} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}
