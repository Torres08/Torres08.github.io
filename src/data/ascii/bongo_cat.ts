export type BongoCatState = 'idle' | 'left' | 'right' | 'both';

/**
 * Pure minimalist ASCII line art (same style and metrics as the project card icons).
 * Every row has an odd length and is centered inside an odd frame width, so the head
 * sits on the exact horizontal center of every frame and nothing shifts between poses.
 *
 * Face: happy star eyes (*) with a tiny "w" mouth.
 */
const FRAME_WIDTH = 23;

const HEAD = (mouth: string): string[] => [
  '/\\_______/\\',
  '/           \\',
  `\\  *  ${mouth}  *  /`,
];

const RAW_FRAMES: Record<BongoCatState, string[]> = {
  idle: [
    ...HEAD('w'),
    '(_)\\_________/(_)',
    '|         |',
    '.-------------------.',
    '| [] [] [] [] [] [] |',
    '|  [] [_______] []  |',
    "'-------------------'",
  ],
  left: [
    ...HEAD('w'),
    '   \\_________/(_)',
    '|         |',
    '.-(_)---------------.',
    '| ** [] [] [] [] [] |',
    '|  [] [_______] []  |',
    "'-------------------'",
  ],
  right: [
    ...HEAD('w'),
    '(_)\\_________/   ',
    '|         |',
    '.---------------(_)-.',
    '| [] [] [] [] [] ** |',
    '|  [] [_______] []  |',
    "'-------------------'",
  ],
  both: [
    ...HEAD('W'),
    '   \\_________/   ',
    '|         |',
    '.-(_)-----------(_)-.',
    '| ** [] [] [] [] ** |',
    '|  [] [_______] []  |',
    "'-------------------'",
  ],
};

function centerRow(row: string): string {
  const total = FRAME_WIDTH - row.length;
  const left = Math.max(0, Math.floor(total / 2));
  return (' '.repeat(left) + row).padEnd(FRAME_WIDTH, ' ');
}

function normalizeFrame(rows: string[]): string {
  return rows.map(centerRow).join('\n');
}

export const BONGO_CAT_FRAMES: Record<BongoCatState, string> = {
  idle: normalizeFrame(RAW_FRAMES.idle),
  left: normalizeFrame(RAW_FRAMES.left),
  right: normalizeFrame(RAW_FRAMES.right),
  both: normalizeFrame(RAW_FRAMES.both),
};
