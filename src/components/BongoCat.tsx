import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BONGO_CAT_FRAMES, type BongoCatState } from '../data/ascii/bongo_cat';
import { prefersReducedMotion } from '../utils/scramble';

interface BongoCatProps {
  motionEnabled: boolean;
}

const MODIFIER_KEYS = new Set([
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'CapsLock',
  'NumLock',
  'ScrollLock',
  'AltGraph',
  'Fn',
  'FnLock',
  'Super',
  'Hyper',
]);

export const BongoCat: React.FC<BongoCatProps> = ({ motionEnabled }) => {
  const [pose, setPose] = useState<BongoCatState>('idle');

  const nextPawRef = useRef<'left' | 'right'>('left');
  const idleTimerRef = useRef<number | null>(null);
  const burstTimersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (burstTimersRef.current.length > 0) {
      burstTimersRef.current.forEach((id) => window.clearTimeout(id));
      burstTimersRef.current = [];
    }
  }, []);

  const scheduleIdle = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setPose('idle');
      idleTimerRef.current = null;
    }, 150);
  }, []);

  const triggerBurst = useCallback(() => {
    if (!motionEnabled || prefersReducedMotion()) return;
    clearTimers();
    setPose('left');
    const t1 = window.setTimeout(() => setPose('right'), 80);
    const t2 = window.setTimeout(() => setPose('both'), 160);
    const t3 = window.setTimeout(() => setPose('idle'), 310);
    burstTimersRef.current = [t1, t2, t3];
  }, [motionEnabled, clearTimers]);

  useEffect(() => {
    if (!motionEnabled || prefersReducedMotion()) {
      clearTimers();
      setPose('idle');
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(e.key)) return;
      if (burstTimersRef.current.length > 0) {
        burstTimersRef.current.forEach((id) => window.clearTimeout(id));
        burstTimersRef.current = [];
      }

      if (e.key === 'Enter' || e.key === ' ') {
        setPose('both');
      } else {
        const paw = nextPawRef.current;
        nextPawRef.current = paw === 'left' ? 'right' : 'left';
        setPose(paw);
      }

      scheduleIdle();
    };

    const onBurstEvent = () => {
      triggerBurst();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('bongo-tap', onBurstEvent);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('bongo-tap', onBurstEvent);
      clearTimers();
    };
  }, [motionEnabled, clearTimers, scheduleIdle, triggerBurst]);

  return (
    <div
      onClick={triggerBurst}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerBurst();
        }
      }}
      aria-label="Interactive ASCII Bongo Cat"
      className="w-full select-none cursor-pointer focus:outline-none overflow-hidden"
    >
      <div className="w-full flex items-center justify-center overflow-hidden">
        <pre
          aria-hidden="true"
          className="m-0 font-mono text-[#EAEAEA]"
          style={{
            whiteSpace: 'pre',
            fontSize: '13px',
            lineHeight: 1.15,
            letterSpacing: '0.04em',
          }}
        >
          {BONGO_CAT_FRAMES[pose]}
        </pre>
      </div>

      <div className="mt-3 w-full border-t border-hairline" aria-hidden="true" />
    </div>
  );
};
