'use client';
import { useEffect, useRef } from 'react';
import { mountCursorFollower } from './cursor-follower.js';
export default function CursorFollower({ basePath = '/mascot', size = 240, label, config }: { basePath?: string; size?: number; label?: string; config?: { frames: Record<string, string> } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const frames = config?.frames || Object.fromEntries(["up-left","up","up-right","left","center","right","down-left","down","down-right"].map(d => [d, basePath + '/frames/' + d + '.webp']));
    const player = mountCursorFollower(ref.current, { frames, size, label });
    return () => player.destroy();
  }, [basePath, size, label, config]);
  return <div ref={ref} />;
}
