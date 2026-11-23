import type { AsciiMotionModule } from './index';

export const wifiRadarAnimation: AsciiMotionModule = {
  id: 'wifiRadar',
  mode: 'procedural',
  width: 18,
  height: 9,
  defaultFps: 8,
  generateFrame: (tick: number) => {
    const phase = tick % 4;
    const arc = [
      `       ( * )      `,
      `     ( ( * ) )    `,
      `   ((  ( * )  ))  `,
      `     . ( * ) .    `,
    ][phase];

    return [
      arc,
      `         |        `,
      `        /|\\       `,
      `       / | \\      `,
      `      /--|--\\     `,
      `     /   |   \\    `,
      `    /____|____\\   `,
      `        ===       `,
    ].join('\n');
  },
};
