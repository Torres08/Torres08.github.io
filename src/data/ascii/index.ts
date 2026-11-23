import type { AsciiAnimationId } from '../../types/portfolio';
import { monogramAnimation } from './monogram';
import { ebpfKernelAnimation } from './ebpfKernel';
import { canBusWaveAnimation } from './canBusWave';
import { wifiRadarAnimation } from './wifiRadar';
import { sbomGraphAnimation } from './sbomGraph';
import { hpcClusterAnimation } from './hpcCluster';

export interface AsciiMotionModule {
  id: AsciiAnimationId;
  mode: 'frames' | 'procedural';
  width: number;
  height: number;
  defaultFps: number;
  /** ASCII Motion compatible frame array (newline-delimited or string[] rows) */
  frames?: string[];
  /** Procedural frame generator for live telemetry + deterministic glitch */
  generateFrame?: (tick: number, glitchIntensity: number) => string;
}

export const ASCII_MODULES: Record<AsciiAnimationId, AsciiMotionModule> = {
  monogram: monogramAnimation,
  ebpfKernel: ebpfKernelAnimation,
  canBusWave: canBusWaveAnimation,
  wifiRadar: wifiRadarAnimation,
  sbomGraph: sbomGraphAnimation,
  hpcCluster: hpcClusterAnimation,
};

const GLITCH_CHARS = ['░', '▒', '▓', '█', '#', '%', '/'];

/** Applies subtle deterministic block-glitch corruption to an ASCII frame */
export function applyAsciiGlitch(frame: string, tick: number, glitchIntensity: number): string {
  if (glitchIntensity <= 0) return frame;
  const prob = (glitchIntensity / 100) * 0.045;
  const lines = frame.split('\n');
  return lines
    .map((line, r) => {
      if ((tick * 7 + r * 13) % 29 > glitchIntensity / 4) return line;
      let out = '';
      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        if (ch === ' ') {
          out += ch;
          continue;
        }
        const hash = ((tick * 31 + r * 17 + c * 11) % 1000) / 1000;
        if (hash < prob) {
          out += GLITCH_CHARS[(tick + r + c) % GLITCH_CHARS.length];
        } else {
          out += ch;
        }
      }
      return out;
    })
    .join('\n');
}
