import React, { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion, scrambleDecode } from '../utils/scramble';

interface AsciiLoaderProps {
  motionEnabled: boolean;
  glitchIntensity: number;
  onComplete: () => void;
}

const DENSITY_CHARS = ['░', '▒', '▓', '█'];

export const AsciiLoader: React.FC<AsciiLoaderProps> = ({
  motionEnabled,
  glitchIntensity,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!motionEnabled || prefersReducedMotion()) {
      onComplete();
      return;
    }

    scrambleDecode(labelRef.current, 'DECRYPTING_PORTFOLIO_NODES // JLTR_SEC', {
      motionEnabled: true,
      duration: 0.9,
      glitchIntensity,
    });

    const totalMs = 1150;
    const start = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setProgress(pct);
      setTick((t) => t + 1);
      if (pct >= 100) {
        window.clearInterval(interval);
        window.setTimeout(onComplete, 90);
      }
    }, 65);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [motionEnabled, glitchIntensity, onComplete]);

  const matrix = useMemo(() => {
    const rows = 8;
    const cols = 42;
    const threshold = progress / 100;
    const lines: string[] = [];
    for (let r = 0; r < rows; r++) {
      let line = '';
      for (let c = 0; c < cols; c++) {
        const idx = ((tick * 13 + r * 7 + c * 5) % 100) / 100;
        if (idx < threshold) {
          line += DENSITY_CHARS[Math.min(3, Math.floor(threshold * 3.9))];
        } else {
          line += DENSITY_CHARS[(tick + r + c) % 3];
        }
      }
      lines.push(line);
    }
    return lines.join('\n');
  }, [progress, tick]);

  const barFilled = Math.round((progress / 100) * 24);
  const bar = '█'.repeat(barFilled) + '░'.repeat(24 - barFilled);

  return (
    <div
      role="dialog"
      aria-label="Portfolio boot loader"
      onClick={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas p-4 cursor-pointer select-none"
    >
      <div className="w-full max-w-lg border border-hairline bg-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-2 text-xs text-muted">
          <span>SYS_BOOT // TTY0</span>
          <span>[ ESC / CLICK TO SKIP ]</span>
        </div>

        <pre
          aria-hidden="true"
          className="overflow-hidden text-xs leading-[1.15] text-primary"
        >
          {matrix}
        </pre>

        <div className="space-y-1.5 text-xs">
          <div ref={labelRef} className="text-primary font-medium tracking-wider">
            DECRYPTING_PORTFOLIO_NODES // JLTR_SEC
          </div>
          <div className="flex items-center justify-between text-muted">
            <span className="text-promptUser">[{bar}]</span>
            <span>{String(progress).padStart(3, '0')}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
