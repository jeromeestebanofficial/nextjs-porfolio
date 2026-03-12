"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
  offsetX: number;
  offsetY: number;
};

const DOT_COLOR = "rgba(230,230,230,0.75)";
const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

type ParticleSettings = {
  proximity: number;
  density: number;
  dotRadius: number;
  targetFps: number;
  drawLines: boolean;
  dprCap: number;
};

const DEFAULT_SETTINGS: ParticleSettings = {
  proximity: 118,
  density: 16000,
  dotRadius: 1.05,
  targetFps: 48,
  drawLines: true,
  dprCap: 1.45,
};

const LOW_POWER_SETTINGS: ParticleSettings = {
  proximity: 92,
  density: 24000,
  dotRadius: 0.95,
  targetFps: 30,
  drawLines: false,
  dprCap: 1.2,
};

export function PageParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let lastPaint = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const hardwareThreads = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lowPowerDevice = coarsePointer || hardwareThreads <= 4 || memory <= 4;
    const settings = lowPowerDevice ? LOW_POWER_SETTINGS : DEFAULT_SETTINGS;
    const frameInterval = 1000 / settings.targetFps;

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      active: false,
    };

    const createParticle = (): Particle => {
      const speedX = (Math.random() - 0.5) * 0.42;
      const speedY = (Math.random() - 0.5) * 0.42;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: speedX,
        vy: speedY,
        layer: 1 + Math.floor(Math.random() * 3),
        offsetX: 0,
        offsetY: 0,
      };
    };

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, settings.dprCap);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(10, Math.round((width * height) / settings.density));
      particles = Array.from({ length: count }, () => createParticle());
    };

    const draw = (timestamp: number) => {
      if (timestamp - lastPaint < frameInterval) {
        frameRef.current = window.requestAnimationFrame(draw);
        return;
      }
      lastPaint = timestamp;
      context.clearRect(0, 0, width, height);
      const projected = new Array<{ x: number; y: number; cellX: number; cellY: number }>(
        particles.length,
      );
      const grid = new Map<string, number[]>();
      const cellSize = settings.proximity;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width) {
          p.vx = -p.vx;
        }
        if (p.y <= 0 || p.y >= height) {
          p.vy = -p.vy;
        }

        if (pointer.active) {
          const targetX = (pointer.x - width / 2) / (24 * p.layer);
          const targetY = (pointer.y - height / 2) / (24 * p.layer);
          p.offsetX += (targetX - p.offsetX) * 0.07;
          p.offsetY += (targetY - p.offsetY) * 0.07;
        } else {
          p.offsetX *= 0.94;
          p.offsetY *= 0.94;
        }
        const x = p.x + p.offsetX;
        const y = p.y + p.offsetY;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellKey = `${cellX},${cellY}`;
        const bucket = grid.get(cellKey);
        if (bucket) {
          bucket.push(i);
        } else {
          grid.set(cellKey, [i]);
        }
        projected[i] = { x, y, cellX, cellY };

        context.beginPath();
        context.fillStyle = DOT_COLOR;
        context.arc(x, y, settings.dotRadius, 0, Math.PI * 2);
        context.fill();
      }

      if (settings.drawLines) {
        for (let i = 0; i < projected.length; i += 1) {
          const p1 = projected[i];
          if (!p1) {
            continue;
          }

          for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
            const neighborKey = `${p1.cellX + offsetX},${p1.cellY + offsetY}`;
            const bucket = grid.get(neighborKey);
            if (!bucket) {
              continue;
            }

            for (let k = 0; k < bucket.length; k += 1) {
              const j = bucket[k];
              if (j <= i) {
                continue;
              }
              const p2 = projected[j];
              if (!p2) {
                continue;
              }
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.hypot(dx, dy);
              if (dist >= settings.proximity) {
                continue;
              }
              const alpha = 1 - dist / settings.proximity;
              context.beginPath();
              context.moveTo(p1.x, p1.y);
              context.lineTo(p2.x, p2.y);
              context.strokeStyle = `rgba(180,180,180,${(0.26 * alpha).toFixed(3)})`;
              context.lineWidth = 1;
              context.stroke();
            }
          }
        }
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onResize = () => setup();

    setup();
    frameRef.current = window.requestAnimationFrame(draw);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
