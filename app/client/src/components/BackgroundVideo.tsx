import { useEffect, useRef } from 'react';

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onCanPlay = () => {
      el.play().catch(() => {});
      if (reduceMotion) {
        el.style.opacity = '1';
        return;
      }
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 600ms ease';
        el.style.opacity = '1';
      });
    };

    el.addEventListener('canplay', onCanPlay);
    if (el.readyState >= 3) onCanPlay();

    if (reduceMotion) el.pause();

    return () => el.removeEventListener('canplay', onCanPlay);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover object-bottom opacity-0"
      aria-hidden="true"
    >
      <source src="/assets/ambient.mp4" type="video/mp4" />
    </video>
  );
}
