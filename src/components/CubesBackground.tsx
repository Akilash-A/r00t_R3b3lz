'use client';

import dynamic from 'next/dynamic';
import { CubesProps } from './Cubes';

const Cubes = dynamic(() => import('./Cubes'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export default function CubesBackground(props: CubesProps) {
  return (
    <div className="w-full h-full">
      <Cubes {...props} />
    </div>
  );
}
