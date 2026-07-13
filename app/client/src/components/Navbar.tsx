import { ScanSearch } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="relative z-20 px-5 pt-5 md:px-6 md:pt-6">
      <div className="liquid-glass mx-auto flex max-w-3xl items-center justify-between rounded-full px-5 py-3 md:px-6">
        <div className="flex items-center gap-2.5">
          <ScanSearch size={22} className="text-white" strokeWidth={1.8} />
          <span className="text-[17px] font-semibold tracking-tight text-white">CRO AI Studio</span>
        </div>
        <a
          href="https://mindtech.solutions/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/50 transition-colors hover:text-white/80 md:text-sm"
        >
          by Mindtech Solutions
        </a>
      </div>
    </div>
  );
}
