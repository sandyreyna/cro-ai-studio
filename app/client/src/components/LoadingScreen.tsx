import { motion } from 'framer-motion';

const PHRASES = ['Leyendo el copy…', 'Revisando los CTAs…', 'Analizando la jerarquía visual…', 'Chequeando señales de SEO y velocidad…'];

interface Props {
  phraseIdx: number;
}

export default function LoadingScreen({ phraseIdx }: Props) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-5 py-12 text-center">
      <div className="relative flex h-[120px] w-[120px] items-center justify-center">
        <span className="animate-pulse-ring absolute inset-0 rounded-full border-[1.5px] border-white/35" />
        <span
          className="animate-pulse-ring absolute inset-0 rounded-full border-[1.5px] border-white/35"
          style={{ animationDelay: '1.1s' }}
        />
        <div
          className="animate-glow h-[70px] w-[70px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9), rgba(255,255,255,0.15))',
            boxShadow: '0 0 50px rgba(255,255,255,0.4)',
          }}
        />
      </div>
      <div>
        <div className="mb-2.5 font-serif text-[32px] text-white">Analizando tu landing…</div>
        <motion.div
          key={phraseIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-[22px] text-[15px] text-white/60"
        >
          {PHRASES[phraseIdx % PHRASES.length]}
        </motion.div>
      </div>
    </div>
  );
}
