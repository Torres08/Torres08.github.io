import React, { useEffect, useRef } from 'react';
import { scrambleDecode } from '../utils/scramble';

interface SectionHeaderProps {
  title: string;
  motionEnabled: boolean;
  glitchIntensity: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  motionEnabled,
  glitchIntensity,
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const hasDecodedRef = useRef(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    if (!motionEnabled) {
      el.textContent = title;
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      scrambleDecode(el, title, { motionEnabled, glitchIntensity });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasDecodedRef.current) {
            hasDecodedRef.current = true;
            scrambleDecode(el, title, { motionEnabled, glitchIntensity });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [title, motionEnabled, glitchIntensity]);

  return (
    <div className="flex items-center gap-4 mb-5">
      <h2
        ref={headingRef}
        className="text-sm sm:text-base font-bold tracking-label text-primary uppercase shrink-0"
      >
        {title}
      </h2>
      <div className="h-[1px] flex-1 bg-hairline" aria-hidden="true" />
    </div>
  );
};
