import { motion } from 'framer-motion';
import { Link2, ArrowRight, AlertCircle, Monitor, Smartphone } from 'lucide-react';
import type { Device } from '../lib/api';

interface Props {
  url: string;
  setUrl: (v: string) => void;
  device: Device;
  setDevice: (d: Device) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onShowHow: () => void;
}

export default function InputScreen({ url, setUrl, device, setDevice, error, onSubmit, onShowHow }: Props) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-5 py-10 text-center md:px-6 md:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-[12ch] font-serif text-[clamp(2.75rem,9vw,5.75rem)] font-normal leading-[1.02] tracking-tight text-white text-balance"
      >
        Mira tu landing como <em className="italic text-white/90">la ve tu cliente</em>.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="max-w-lg text-sm leading-relaxed text-white/70 md:text-base"
      >
        Pega la URL y recibe un análisis de copy, CTAs, jerarquía y señales de SEO en menos de 20 segundos, junto con
        un wireframe de cómo se vería tu landing mejorada.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
        onSubmit={onSubmit}
        noValidate
        className="flex w-full max-w-xl flex-col gap-3.5"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-white/45">Analizar versión</span>
          <div className="liquid-glass flex gap-1 rounded-full p-1">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                device === 'desktop' ? 'bg-white text-black' : 'bg-transparent text-white/60 hover:text-white/80'
              }`}
            >
              <Monitor size={15} />
              Escritorio
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                device === 'mobile' ? 'bg-white text-black' : 'bg-transparent text-white/60 hover:text-white/80'
              }`}
            >
              <Smartphone size={15} />
              Móvil
            </button>
          </div>
        </div>

        <div className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-5 pr-2">
          <Link2 size={18} className="flex-shrink-0 text-white/40" />
          <input
            type="text"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://tulandingpage.com"
            className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-white placeholder:text-white/40 focus:outline-none"
          />
          <motion.button
            type="submit"
            aria-label="Analizar"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.4)]"
          >
            <ArrowRight size={20} strokeWidth={2.2} />
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass flex items-start gap-3 rounded-2xl px-4.5 py-4 text-left"
          >
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-white" />
            <span className="text-sm leading-relaxed text-white/80">{error}</span>
          </motion.div>
        )}
      </motion.form>

      <button
        type="button"
        onClick={onShowHow}
        className="text-xs text-white/50 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white/85"
      >
        ¿Cómo funciona?
      </button>
    </div>
  );
}
