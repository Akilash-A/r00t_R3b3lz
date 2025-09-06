'use client';

import PixelBlast from './PixelBlast';

export default function PixelBlastBackground() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
      <PixelBlast
        variant="square"
        pixelSize={6}
        color="#B19EEF"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid={false}
        speed={0.6}
        edgeFade={0.25}
        transparent
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
