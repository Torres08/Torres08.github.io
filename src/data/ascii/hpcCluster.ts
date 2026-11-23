import type { AsciiMotionModule } from './index';

export const hpcClusterAnimation: AsciiMotionModule = {
  id: 'hpcCluster',
  mode: 'procedural',
  width: 18,
  height: 9,
  defaultFps: 8,
  generateFrame: (tick: number) => {
    const active = tick % 3;
    const led0 = active === 0 ? '*' : 'o';
    const led1 = active === 1 ? '*' : 'o';
    const led2 = active === 2 ? '*' : 'o';

    return [
      ` +--------------+ `,
      ` | [=====]  (${led0}) | `,
      ` +--------------+ `,
      ` | [=====]  (${led1}) | `,
      ` +--------------+ `,
      ` | [=====]  (${led2}) | `,
      ` +--------------+ `,
      ` |  |        |  | `,
      ` '--'--------'--' `,
    ].join('\n');
  },
};
