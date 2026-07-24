import type { ReactElement } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface GooglePlayIconProps {
  readonly size?: number;
  /**
   * When set, renders the whole mark in this single color instead of the
   * multi-color logo — use on colored backgrounds (e.g. a tinted button) where
   * the brand colors don't contrast.
   */
  readonly color?: string;
}

export function GooglePlayIcon({ size = 22, color }: GooglePlayIconProps): ReactElement {
  if (color) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M3 2.5 L12 12 L3 21.5 Z" fill={color} />
        <Path d="M3 2.5 L15 9 L12 12 Z" fill={color} />
        <Path d="M12 12 L15 15 L3 21.5 Z" fill={color} />
        <Path d="M15 9 L21 12 L15 15 L12 12 Z" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="blue_green" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#00C3FF" />
          <Stop offset="1" stopColor="#1BE2A0" />
        </LinearGradient>
      </Defs>
      {/* Blue - top left */}
      <Path d="M3 2.5 L12 12 L3 21.5 Z" fill="#4285F4" />
      {/* Green - top right */}
      <Path d="M3 2.5 L15 9 L12 12 Z" fill="#0F9D58" />
      {/* Red - bottom right */}
      <Path d="M12 12 L15 15 L3 21.5 Z" fill="#DB4437" />
      {/* Yellow - right */}
      <Path d="M15 9 L21 12 L15 15 L12 12 Z" fill="#F4B400" />
    </Svg>
  );
}
