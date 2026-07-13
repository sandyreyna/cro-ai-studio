import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/[0.14] bg-[rgba(20,20,22,0.85)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="mb-4.5 font-serif text-[28px] text-white">Cómo funciona</div>
            <div className="mb-4 flex gap-3.5">
              <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold">
                1
              </div>
              <div className="text-sm leading-relaxed text-white/72">
                <strong className="text-white">Análisis por URL.</strong> Leemos el HTML real de tu landing y
                evaluamos copy, CTAs, jerarquía y señales de SEO.
              </div>
            </div>
            <div className="mb-6 flex gap-3.5">
              <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold">
                2
              </div>
              <div className="text-sm leading-relaxed text-white/72">
                <strong className="text-white">Wireframe mejorado.</strong> Generamos un boceto de cómo se vería tu
                landing aplicando las recomendaciones, respetando tu color de marca.
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.01]"
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
