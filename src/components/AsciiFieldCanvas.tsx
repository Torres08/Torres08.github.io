import React, { useEffect, useRef } from 'react';
import type { CanvasDensity, ThemeMode } from '../types/portfolio';
import { prefersReducedMotion } from '../utils/scramble';

interface AsciiFieldCanvasProps {
  motionEnabled: boolean;
  density?: CanvasDensity;
  theme?: ThemeMode;
  variant?: 'full' | 'subtle';
  activeOnlyOnHover?: boolean;
  isHovered?: boolean;
}

const GLYPHS = ['░', '▒', '▓', '/', '\\', '+'];

export const AsciiFieldCanvas: React.FC<AsciiFieldCanvasProps> = ({
  motionEnabled,
  density = 'standard',
  theme,
  variant = 'full',
  activeOnlyOnHover = false,
  isHovered,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const hoveredRef = useRef<boolean>(Boolean(isHovered));

  useEffect(() => {
    hoveredRef.current = Boolean(isHovered);
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize =
      variant === 'subtle'
        ? density === 'dense'
          ? 18
          : 22
        : density === 'compact'
          ? 24
          : density === 'dense'
            ? 14
            : 18;

    const reduced = prefersReducedMotion();
    const animate = motionEnabled && !reduced;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let isVisible = true;

    const getPaletteColors = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        accent: styles.getPropertyValue('--prompt-user').trim() || '#9a6cc6',
        hairline: styles.getPropertyValue('--border-hairline').trim() || '#1e1e1e',
      };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const drawFrame = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);

      const mActive = mouseRef.current.active || hoveredRef.current;
      if (activeOnlyOnHover && (!mActive || !animate)) {
        return;
      }

      const { accent, hairline } = getPaletteColors();
      ctx.font = `12px 'IBM Plex Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);
      const t = animate ? timeMs * 0.0022 : 0;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const baseAlpha = variant === 'subtle' ? 0.14 : 0.32;
      const cursorAlpha = variant === 'subtle' ? 0.28 : 0.52;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * cellSize + cellSize / 2;
          const py = r * cellSize + cellSize / 2;

          let energy = Math.sin(c * 0.35 + t) * Math.cos(r * 0.45 - t * 0.8);
          let nearCursor = false;

          if (mouseRef.current.active && animate) {
            const dx = px - mx;
            const dy = py - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              const falloff = 1 - dist / 130;
              energy += falloff * 2.2 * Math.sin(dist * 0.14 - t * 3.5);
              nearCursor = dist < 90;
            }
          }

          const norm = Math.min(1, Math.max(0, (energy + 1.2) / 3.2));
          const glyphIndex = Math.min(
            GLYPHS.length - 1,
            Math.floor(norm * GLYPHS.length),
          );

          ctx.fillStyle = nearCursor ? accent : hairline;
          ctx.globalAlpha = nearCursor ? cursorAlpha : baseAlpha;
          ctx.fillText(GLYPHS[glyphIndex], px, py);
        }
      }
      ctx.globalAlpha = 1;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      if (activeOnlyOnHover) {
        ctx.clearRect(0, 0, width, height);
      }
    };

    const parentEl = canvas.parentElement;
    parentEl?.addEventListener('mousemove', onMouseMove);
    parentEl?.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', resize);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      });
      observer.observe(canvas);
    }

    if (!animate) {
      drawFrame(0);
    } else {
      const loop = (now: number) => {
        if (isVisible) {
          drawFrame(now);
        }
        rafId = window.requestAnimationFrame(loop);
      };
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      parentEl?.removeEventListener('mousemove', onMouseMove);
      parentEl?.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', resize);
      observer?.disconnect();
    };
  }, [motionEnabled, density, theme, variant, activeOnlyOnHover]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};
