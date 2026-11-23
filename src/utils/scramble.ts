import { useCallback, useRef } from 'react';
import gsap from 'gsap';

const SCRAMBLE_GLYPHS = '░▒▓█<>/\\|[]{}0123456789ABCDEF*+#';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * GSAP-driven character-scramble decode on an HTML element's textContent.
 * Falls back immediately to final text when motion is disabled or reduced motion is active.
 */
export function scrambleDecode(
  el: HTMLElement | null,
  targetText: string,
  options: {
    motionEnabled: boolean;
    duration?: number;
    glitchIntensity?: number;
  },
): gsap.core.Tween | null {
  if (!el) return null;

  if (!options.motionEnabled || prefersReducedMotion()) {
    el.textContent = targetText;
    return null;
  }

  const duration = options.duration ?? 0.65;
  const intensity = Math.max(0.1, (options.glitchIntensity ?? 100) / 100);
  const length = targetText.length;
  const state = { progress: 0 };

  return gsap.to(state, {
    progress: 1,
    duration,
    ease: 'steps(16)',
    onUpdate: () => {
      const revealed = Math.floor(state.progress * length);
      let out = '';
      for (let i = 0; i < length; i++) {
        const ch = targetText[i];
        if (ch === ' ' || ch === '\n') {
          out += ch;
        } else if (i < revealed) {
          out += ch;
        } else if (i < revealed + Math.ceil(6 * intensity)) {
          const idx = Math.floor((state.progress * 97 + i * 13) % SCRAMBLE_GLYPHS.length);
          out += SCRAMBLE_GLYPHS[idx];
        } else {
          out += '░';
        }
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = targetText;
    },
  });
}

/**
 * Reusable hover/focus scramble hook for buttons, nav links, chips, and CTAs.
 * Honors motionEnabled and prefers-reduced-motion.
 */
export function useScrambleHover(
  label: string,
  options: {
    motionEnabled: boolean;
    glitchIntensity?: number;
    duration?: number;
  },
) {
  const elRef = useRef<HTMLSpanElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const trigger = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    if (!options.motionEnabled || prefersReducedMotion()) {
      el.textContent = label;
      return;
    }
    tweenRef.current?.kill();
    tweenRef.current = scrambleDecode(el, label, {
      motionEnabled: options.motionEnabled,
      glitchIntensity: options.glitchIntensity ?? 100,
      duration: options.duration ?? 0.34,
    });
  }, [label, options.motionEnabled, options.glitchIntensity, options.duration]);

  return {
    elRef,
    onMouseEnter: trigger,
    onFocus: trigger,
  };
}
