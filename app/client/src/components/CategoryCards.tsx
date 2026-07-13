import type { Category } from '../lib/api';

interface Props {
  categories: Category[];
}

export default function CategoryCards({ categories }: Props) {
  return (
    <div className="my-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {categories.map((c) => (
        <div key={c.name} className="rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] text-white/65">{c.name}</span>
            <span className="font-serif text-[26px] text-white">{c.score}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white/85" style={{ width: `${c.score}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
