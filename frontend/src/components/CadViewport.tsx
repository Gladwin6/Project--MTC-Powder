'use client';
import { useRef, useEffect } from 'react';
import { useScene, type SceneHandle } from '@/hooks/useScene';

interface Props {
  onReady: (handle: SceneHandle) => void;
}

export function CadViewport({ onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneHandleRef = useScene(canvasRef);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (sceneHandleRef.current && !notifiedRef.current) {
      notifiedRef.current = true;
      onReady(sceneHandleRef.current);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="cad-canvas"
      aria-label="3D CAD viewport"
    />
  );
}
