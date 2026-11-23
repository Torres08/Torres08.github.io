import type { AsciiMotionModule } from './index';

export const ebpfKernelAnimation: AsciiMotionModule = {
  id: 'ebpfKernel',
  mode: 'procedural',
  width: 18,
  height: 9,
  defaultFps: 8,
  generateFrame: (tick: number) => {
    const core = ['*', 'o', '#', '.'][tick % 4];

    return [
      `     .------.     `,
      `    /        \\    `,
      `    |        |    `,
      `  .+----------+.  `,
      `  |            |  `,
      `  |    (${core})     |  `,
      `  |     ||     |  `,
      `  |            |  `,
      `  '------------'  `,
    ].join('\n');
  },
};
