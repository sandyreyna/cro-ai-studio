import { useEffect, useRef, useState, type FormEvent } from 'react';
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import InputScreen from './components/InputScreen';
import LoadingScreen from './components/LoadingScreen';
import HowItWorksModal from './components/HowItWorksModal';
import ResultsScreen from './components/ResultsScreen';
import { analyzeUrl, type AnalyzeResult, type Device, type SectionType } from './lib/api';

type View = 'input' | 'loading' | 'results';

export default function App() {
  const [view, setView] = useState<View>('input');
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<Device>('desktop');
  const [error, setError] = useState('');
  const [showHow, setShowHow] = useState(false);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  // Hover (mouse preview) and click/tap (sticky) are tracked separately: a
  // mouse click always fires a hover-enter right before the click event, so a
  // single toggle-on-click naively fighting that hover state would flip back
  // off in the same gesture — same failure mode as a tap on a touch device.
  const [hoveredSection, setHoveredSection] = useState<SectionType | 'general' | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionType | 'general' | null>(null);
  const activeSection = hoveredSection ?? selectedSection;

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Pega la URL de tu landing page para empezar.');
      return;
    }
    setError('');
    setHoveredSection(null);
    setSelectedSection(null);
    setView('loading');

    try {
      const structural = await analyzeUrl(trimmed, device);
      setResult(structural);
      setView('results');
    } catch (err) {
      setView('input');
      setError(err instanceof Error ? err.message : 'No pudimos analizar esa URL. Inténtalo de nuevo.');
    }
  }

  function handleReset() {
    setView('input');
    setHoveredSection(null);
    setSelectedSection(null);
    setError('');
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
              onShowHow={() => setShowHow(true)}
            />
          )}

          {view === 'loading' && <LoadingScreen phraseIdx={phraseIdx} />}

          <div className="relative z-10 flex justify-center pb-9">
            <span className="text-xs text-white/30">Hecho por Mindtech Solutions</span>
          </div>

          <HowItWorksModal open={showHow} onClose={() => setShowHow(false)} />
        </div>
      )}

      {view === 'results' && result && (
        <ResultsScreen
          result={result}
          activeSection={activeSection}
          onHover={setHoveredSection}
          onSelect={(section) => setSelectedSection((cur) => (cur === section ? null : section))}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
