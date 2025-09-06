'use client';

import dynamic from 'next/dynamic';
import { CubesProps } from './Cubes';

const Cubes = dynamic(() => import('./Cubes'), {
  ssr: false,
  loading: () => <div className="relative w-1/2 max-md:w-11/12 aspect-square bg-transparent" />
});

export default function CubesBackground(props: CubesProps) {
  return <Cubes {...props} />;
}
