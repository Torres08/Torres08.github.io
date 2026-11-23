import type { AsciiMotionModule } from './index';

export const sbomGraphAnimation: AsciiMotionModule = {
  id: 'sbomGraph',
  mode: 'procedural',
  width: 20,
  height: 9,
  defaultFps: 8,
  generateFrame: (tick: number) => {
    const beacon = tick % 2 === 0 ? '*' : 'o';
    const water =
      tick % 2 === 0
        ? ` ~~~~~~~~~~~~~~~~~~ `
        : `  ~~~~~~~~~~~~~~~~  `;

    return [
      `             [${beacon}]    `,
      `     +----+  | |    `,
      `     |####|  | |    `,
      `  +----+----+---+   `,
      `  |####|####| o |   `,
      ` .+-------------+-. `,
      ` \\   o   o   o   / `,
      `  '-------------'  `,
      water,
    ].join('\n');
  },
};
