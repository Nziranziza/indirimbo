import { useId } from "react";
import Svg, { Circle, Defs, G, Mask, Path, Rect } from "react-native-svg";

interface SdaFlameIconProps {
  readonly size?: number;
  readonly color?: string;
}

// Official Seventh-day Adventist symbol (flame + open book + cross), traced from
// the public "Adventist Symbol" vector. That source draws the symbol as negative
// space inside a filled disc, so a single mask reveals just the symbol: a white
// disc marks the revealed area, the black symbol path punches the flame/book/
// cross back out, and the disc's rim falls outside the mask so it never shows.
// Monochrome: tints via the `color` prop, so it drops in like an IconSymbol.
const PATH =
  "m 128.7,161.7 c -11.5,-1.9 -17.7,3.5 -19.6,8.6 -0.2,0.5 -0.7,0.4 -0.7,0 v -1.6 c 0,-5.7 5.1,-10.9 11.1,-17 l 10,-10 26.6,4.6 c 0,0 7.6,7.6 14.1,14.1 12.5,-14.8 20.1,-34 20.1,-54.9 0,-46.9 -38,-84.9 -84.9,-84.9 -46.9,0 -84.9,38 -84.9,84.9 0,20.9 7.6,40.1 20.1,54.9 6.5,-6.5 14.1,-14.1 14.1,-14.1 l 30.2,-5.2 c 14,-2.4 17.5,0.7 17.5,5.4 0,0.2 -0.2,0.4 -0.4,0.4 h -8.5 c -0.2,0 -0.2,0.2 -0.2,0.4 v 5.2 c 0,0.2 -0.2,0.2 0,0.2 h 8.7 c 0.2,0 0.4,0.2 0.4,0.4 0,0 0,16.9 0,17.3 0,0.4 -0.5,0.5 -0.7,0.1 -1.9,-5.1 -8.1,-10.5 -19.6,-8.6 0,0 -19.9,3.4 -34.7,6 15.2,14.1 35.5,22.8 57.9,22.8 22.4,0 42.7,-8.6 57.9,-22.8 -14.6,-2.8 -34.5,-6.2 -34.5,-6.2 z m -19.5,0.2 c -0.1,0.5 -0.7,0.5 -0.7,0 V 153 c 0,-0.2 0.1,-0.4 0.3,-0.4 h 4.4 c -1.9,2.7 -3.2,5.3 -4,9.3 z m 31.5,-55.5 c 2.1,6.9 0.7,17.4 -9.2,27.4 l -12,11.8 c -0.3,0.3 -0.7,0.8 -1,0.8 h -8.2 c 2,-3 5.4,-6.8 9.2,-10.6 l 8.3,-8.3 C 138.3,117 140,112 140,106.2 c 0.1,-0.4 0.6,-0.4 0.7,0.2 z m -16.3,-6.5 c 6.8,-6.8 8.5,-14.7 3,-19.4 -0.5,-0.4 -0.2,-0.9 0.4,-0.6 6.8,3.1 12.1,14.3 0.5,25.9 l -8.8,8.8 c -6,6 -8.8,8.8 -10.3,16.1 -0.1,0.5 -0.7,0.5 -0.7,0 v -8.9 c 0,-5.7 5,-10.9 11.1,-17 z m -54.1,8 C 68.2,101 69.6,90.5 79.5,80.5 l 26.4,-26.4 c 6,-6 9.1,-8.9 10.6,-16.1 0.1,-0.5 1,-0.5 1,0 v 8.9 c 0,5.7 -5.3,10.9 -11.4,17 L 83.3,86.6 C 72.7,97.2 71,102.1 71,107.9 c 0,0.6 -0.5,0.6 -0.7,0 z m 4,15.7 c -5.9,-7.2 -3.9,-18.4 7.7,-30 l 23.9,-23.9 c 6,-6 9.1,-8.9 10.6,-16.2 0.1,-0.5 1,-0.5 1,0 v 9 c 0,5.7 -5.3,10.9 -11.4,17 l -21.2,21.1 c -4.4,4.4 -13.9,13.8 -10,22.6 0.3,0.6 -0.2,0.9 -0.6,0.4 z m 12.3,-9.2 c -6.8,6.8 -8.5,14.7 -3,19.4 0.5,0.4 0.2,0.9 -0.4,0.6 -6.8,-3.1 -12.1,-14.3 -0.5,-25.9 l 23.2,-23.2 c 6,-6 9.1,-8.8 10.6,-16.1 0.1,-0.5 1,-0.5 1,0 v 8.9 c 0,5.7 -5.3,10.9 -11.4,17 z m 21.9,23 c 0,-5.7 5,-10.9 11.1,-17 l 6.7,-6.7 c 4.4,-4.4 13.8,-13.8 9.9,-22.6 -0.3,-0.6 0.2,-0.9 0.6,-0.4 5.9,7.2 3.9,18.4 -7.7,30 l -9.5,9.5 c -6,6 -8.8,8.9 -10.3,16.2 -0.1,0.5 -0.7,0.5 -0.7,0 v -9 z";

export function SdaFlameIcon({ size = 24, color = "#000000" }: SdaFlameIconProps) {
  const maskId = `sda-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 169.8 170.1" fill="none">
      <Defs>
        <Mask id={maskId}>
          {/* Reveal only inside the symbol's disc — without this the tint bleeds
              into the corners and the disc's outline shows. */}
          <Circle cx="84.9" cy="85" r="82" fill="#fff" />
          <G transform="translate(-20.5 -20.6)">
            <Path d={PATH} fill="#000" />
          </G>
        </Mask>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="169.8"
        height="170.1"
        fill={color}
        mask={`url(#${maskId})`}
      />
    </Svg>
  );
}
