import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  analyzedUrl: string;
}

const PHONE_DISPLAY = '940 242 832';
const WHATSAPP_NUMBER = '51958157341';

function buildMessage(analyzedUrl: string) {
  return `Hola! Ya pagué S/20 por mi reporte completo de CRO AI Studio 🎉

🔗 Mi landing analizada: ${analyzedUrl}
📧 Mi correo para recibir el PDF:

Adjunto el comprobante de pago 👇`;
}

export default function UnlockModal({ open, onClose, analyzedUrl }: Props) {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(analyzedUrl))}`;

  return (
    <>
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
            className="relative w-full max-w-md rounded-3xl border border-white/[0.14] bg-[rgba(20,20,22,0.85)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-5 top-5 text-white/40 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mb-5 pr-6 font-serif text-[28px] leading-tight text-white">Desbloquea tu reporte completo</div>

            <ol className="mb-6 flex flex-col gap-4">
              <li className="flex gap-3.5">
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold">
                  1
                </span>
                <span className="text-sm leading-relaxed text-white/75">
                  Yapea o Plinea <strong className="text-white">S/20</strong> a Sandy Reyna
                  <br />
                  📱 {PHONE_DISPLAY}
                </span>
              </li>
              <li className="flex gap-3.5">
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold">
                  2
                </span>
                <span className="text-sm leading-relaxed text-white/75">Envíanos tu comprobante con un solo click 👇</span>
              </li>
            </ol>

            <motion.a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: '#25D366', color: '#fff' }}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-shadow hover:shadow-[0_0_24px_rgba(37,211,102,0.45)]"
            >
              <MessageCircle size={17} strokeWidth={2} />
              Enviar comprobante por WhatsApp
            </motion.a>

            <p className="mt-4 text-center text-xs leading-relaxed text-white/40">
              Recibirás tu reporte completo el mismo día, por WhatsApp o correo.
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
