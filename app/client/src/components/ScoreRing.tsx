interface Props {
  score: number;
}

export default function ScoreRing({ score }: Props) {
  const deg = Math.round((score / 100) * 360);
  return (
    <div className="relative h-[132px] w-[132px] flex-shrink-0">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(#fff ${deg}deg, rgba(255,255,255,0.12) ${deg}deg)` }}
      />
      <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-black">
        <span className="font-serif text-[48px] leading-none text-white">{score}</span>
        <span className="text-[11px] tracking-[0.1em] text-white/45">/ 100</span>
      </div>
    </div>
  );
}
