'use client'

import dynamic from 'next/dynamic'

/**
 * Spline scene wrapper.
 * Loaded with `ssr: false`: the Spline runtime is browser-only, and
 * react-spline touches React internals during server prerender.
 * The loader placeholder keeps layout stable while the runtime
 * (~1 MB) streams in.
 */
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span
        aria-label="Loading 3D scene"
        className="size-8 animate-spin rounded-full border-2 border-mist border-t-transparent motion-reduce:animate-none"
      />
    </div>
  ),
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return <Spline scene={scene} className={className} />
}
