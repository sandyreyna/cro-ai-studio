import { useEffect, useRef, useState, type FormEvent } from 'react';
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import InputScreen from './components/InputScreen';
import LoadingScreen from './components/LoadingScreen';
import HowItWorksModal from './components/HowItWorksModal';
import ResultsScreen from './components/ResultsScreen';
import { analyzeUrl, annotateImage, ApiError, type AnalyzeResult, type Device, type Finding } from './lib/api';

type View = 'input' | 'loading' | 'results';

function renumber(findings: Finding[]): Finding[] {
  return findings.map((f, i) => ({ ...f, id: i + 1 }));
}

export default function App() {
  const [view, setView] = useState<View>('input');
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<Device>('desktop');
  const [error, setError] = useState('');
  const [showHow, setShowHow] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [imageAnalyzing, setImageAnalyzing] = useState(false);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  // Hover (mouse preview) and click/tap (sticky) are tracked separately: a
  // mouse click always fires a hover-enter right before the click event, so a
  // single toggle-on-click naively fighting that hover state would flip back
  // off in the same gesture — same failure mode as a tap on a touch device.
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const activeId = hoveredId ?? selectedId;

  const phraseInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (view !== 'loading') {
      if (phraseInterval.current) clearInterval(phraseInterval.current);
      return;
    }
    setPhraseIdx(0);
    phraseInterval.current = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % 4);
    }, 1600);
    return () => {
      if (phraseInterval.current) clearInterval(phraseInterval.current);
    };
  }, [view]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleFile(file: File) {
    setImageError('');
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Pega la URL de tu landing page para empezar.');
      return;
    }
    setError('');
    setImageError('');
    setHoveredId(null);
    setSelectedId(null);
    setView('loading');

    try {
      const [structuralSettled, visualSettled] = await Promise.allSettled([
        analyzeUrl(trimmed, device),
        imageFile ? annotateImage(imageFile, trimmed, device) : Promise.resolve(null),
      ]);

      if (structuralSettled.status === 'rejected') {
        setView('input');
        setError(
          structuralSettled.reason instanceof Error
            ? structuralSettled.reason.message
            : 'No pudimos analizar esa URL. Inténtalo de nuevo.',
        );
        return;
      }

      const structural = structuralSettled.value;
      let findings = structural.findings;
      let visualErr = '';

      if (imageFile) {
        if (visualSettled.status === 'fulfilled' && visualSettled.value) {
          // Visual findings first: their numbers then match the markers on the
          // screenshot 1:1 from the top of the list, instead of starting mid-list.
          findings = [...visualSettled.value.findings, ...findings];
        } else {
          visualErr =
            visualSettled.status === 'rejected' && visualSettled.reason instanceof Error
              ? visualSettled.reason.message
              : 'No pudimos generar el anotado visual de tu captura. El análisis por URL sigue disponible.';
        }
      }

      setResult({ ...structural, findings: renumber(findings) });
      setImageError(visualErr);
      setView('results');
    } catch {
      setView('input');
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    }
  }

  async function handleAttachInResults(file: File) {
    handleFile(file);
    if (!result) return;
    setImageAnalyzing(true);
    setImageError('');
    try {
      const visual = await annotateImage(file, result.analyzedUrl, result.device);
      setResult((r) => (r ? { ...r, findings: renumber([...visual.findings, ...r.findings]) } : r));
    } catch (err) {
      setImageError(err instanceof ApiError ? err.message : 'No pudimos generar el anotado visual de tu captura.');
    } finally {
      setImageAnalyzing(false);
    }
  }

  function handleReset() {
    setView('input');
    setHoveredId(null);
    setSelectedId(null);
    setError('');
    setImageError('');
  }

  const showHero = view === 'input' || view === 'loading';

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      {showHero && (
        <div className="relative flex min-h-screen flex-col overflow-hidden">
          <BackgroundVideo />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)',
            }}
          />

          <Navbar />

          {view === 'input' && (
            <InputScreen
              url={url}
              setUrl={setUrl}
              device={device}
              setDevice={setDevice}
              error={error}
              onSubmit={handleSubmit}
              hasImage={Boolean(imageFile)}
              imageName={imageFile?.name}
              onFile={handleFile}
              onImageError={setImageError}
              onShowHow={() => setShowHow(true)}
            />
          )}

          {view === 'loading' && <LoadingScreen phraseIdx={phraseIdx} />}

          {imageError && view === 'input' && (
            <div className="relative z-10 mx-auto -mt-2 mb-2 max-w-xl px-6 text-center text-xs text-white/50">
              {imageError}
            </div>
          )}

          <div className="relative z-10 flex justify-center pb-9">
            <span className="text-xs text-white/30">Hecho por Mindtech Solutions</span>
          </div>

          <HowItWorksModal open={showHow} onClose={() => setShowHow(false)} />
        </div>
      )}

      {view === 'results' && result && (
        <ResultsScreen
          result={result}
          imageUrl={imagePreview}
          activeId={activeId}
          onHover={setHoveredId}
          onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
          onFile={handleAttachInResults}
          onImageError={setImageError}
          imageAnalyzing={imageAnalyzing}
          imageError={imageError}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
