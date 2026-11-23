import React from 'react';
import { useScrambleHover } from '../utils/scramble';

interface ScrambleTextProps {
  text: string;
  motionEnabled: boolean;
  glitchIntensity?: number;
  className?: string;
}

/**
 * Renders text that scrambles on hover/focus of its parent or itself.
 * Wrap inside interactive buttons/links or use useScrambleHover directly.
 */
export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  motionEnabled,
  glitchIntensity,
  className = '',
}) => {
  const { elRef, onMouseEnter, onFocus } = useScrambleHover(text, {
    motionEnabled,
    glitchIntensity,
  });

  return (
    <span
      ref={elRef}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      className={className}
    >
      {text}
    </span>
  );
};
