import type { AsciiMotionModule } from './index';

export const canBusWaveAnimation: AsciiMotionModule = {
  id: 'canBusWave',
  mode: 'procedural',
  width: 18,
  height: 9,
  defaultFps: 8,
  generateFrame: (tick: number) => {
    const scan = ['[*..]', '[.*.]', '[..*]'][tick % 3];

    return [
      `    |  |  |  |    `,
      `  .+----------+.  `,
      `  | +--------+ |  `,
      ` -| |  ECU   | |- `,
      ` -| | ${scan}  | |- `,
      ` -| | [====] | |- `,
      `  | +--------+ |  `,
      `  '------------'  `,
      `    |  |  |  |    `,
    ].join('\n');
  },
};
