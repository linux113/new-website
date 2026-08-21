'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Spline scene wrapper.
 *
 * Drives @splinetool/runtime directly on a <canvas> instead of using
 * the @splinetool/react-spline wrapper: that wrapper touches React 18
 * internals (ReactCurrentDispatcher) which no longer exist in
 * React 19, crashing the page client-side. The runtime itself is
 * framework-agnostic and loads fine.
 *
 * Runtime is imported dynamically inside the effect — browser-only,
 * nothing during SSR — and disposed on unmount.
 */

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    // Loose type: the runtime is imported dynamically.
    let app: { dispose?: () => void } | null = null

    ;(async () => {
      try {
        const { Application } = await import('@splinetool/runtime')
        if (cancelled) return
        const instance = new Application(canvas)
        app = instance
        await instance.load(scene)
        if (!cancelled) setState('ready')
      } catch (error) {
        console.warn('Spline scene failed to load:', error)
        if (!cancelled) setState('error')
      }
    })()

    return () => {
      cancelled = true
      try {
        app?.dispose?.()
      } catch {
        /* runtime already torn down */
      }
    }
  }, [scene])

  return (
    <div className={cn('relative h-full w-full', className)}>
      {state === 'loading' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-label="Loading 3D scene"
            className="size-8 animate-spin rounded-full border-2 border-mist border-t-transparent motion-reduce:animate-none"
          />
        </div>
      ) : null}
      {state === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-mono-micro text-mist">3D SCENE UNAVAILABLE</span>
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ opacity: state === 'ready' ? 1 : 0, transition: 'opacity 300ms ease' }}
      />
    </div>
  )
}
