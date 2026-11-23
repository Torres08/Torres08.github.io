import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ASCII_MODULES, applyAsciiGlitch } from '../data/ascii';
import type { AsciiAnimationId, PlaybackMode } from '../types/portfolio';
import { prefersReducedMotion } from '../utils/scramble';

interface AsciiPlayerProps {
  animationId: AsciiAnimationId;
  fps?: number;
  playbackMode?: PlaybackMode;
  motionEnabled: boolean;
  glitchIntensity?: number;
  isParentHovered?: boolean;
  className?: string;
}

export const AsciiPlayer: React.FC<AsciiPlayerProps> = ({
  animationId,
  fps,
  playbackMode = 'always',
  motionEnabled,
  glitchIntensity = 100,
  isParentHovered = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isSelfHovered, setIsSelfHovered] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);

  const module = ASCII_MODULES[animationId];
  const effectiveFps = Math.max(6, Math.min(24, fps ?? module.defaultFps));
  const hovered = isParentHovered || isSelfHovered;
  const reducedMotion = prefersReducedMotion();

  const shouldAnimate =
    motionEnabled &&
    !reducedMotion &&
    isVisible &&
    (playbackMode === 'always' || hovered);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;

    const intervalMs = Math.round(1000 / effectiveFps);
    const timer = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [shouldAnimate, effectiveFps]);

  const frameText = useMemo(() => {
    let baseFrame = '';
    if (module.mode === 'frames' && module.frames && module.frames.length > 0) {
      baseFrame = module.frames[tick % module.frames.length];
    } else if (module.generateFrame) {
      baseFrame = module.generateFrame(tick, glitchIntensity);
    }

    if (!motionEnabled || reducedMotion) {
      return baseFrame;
    }

    return applyAsciiGlitch(baseFrame, tick, glitchIntensity);
  }, [module, tick, glitchIntensity, motionEnabled, reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onMouseEnter={() => setIsSelfHovered(true)}
      onMouseLeave={() => setIsSelfHovered(false)}
      className={`w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      <pre
        className={`m-0 font-mono transition-none ${
          hovered ? 'text-[#9A6CC6]' : 'text-[#EAEAEA]'
        }`}
        style={{
          whiteSpace: 'pre',
          fontSize: '13px',
          lineHeight: 1.15,
          letterSpacing: '0.04em',
        }}
      >
        {frameText}
      </pre>
    </div>
  );
};
