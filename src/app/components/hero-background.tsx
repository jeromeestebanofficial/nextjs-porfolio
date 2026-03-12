"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  ampX: number;
  ampY: number;
  speed: number;
  phase: number;
  size: number;
  close: number[];
};

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;

    const distSq = (aX: number, aY: number, bX: number, bY: number) =>
      (aX - bX) ** 2 + (aY - bY) ** 2;

    const buildGraph = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const spacingX = Math.max(90, width / 18);
      const spacingY = Math.max(80, height / 14);
      const nextPoints: Point[] = [];

      for (let x = 0; x < width + spacingX; x += spacingX) {
        for (let y = 0; y < height + spacingY; y += spacingY) {
          const px = x + Math.random() * spacingX * 0.8;
          const py = y + Math.random() * spacingY * 0.8;
          nextPoints.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            ampX: 15 + Math.random() * 45,
            ampY: 10 + Math.random() * 35,
            speed: 0.35 + Math.random() * 0.65,
            phase: Math.random() * Math.PI * 2,
            size: 1 + Math.random() * 2,
            close: [],
          });
        }
      }

      for (let i = 0; i < nextPoints.length; i += 1) {
        const p = nextPoints[i];
        const nearest = nextPoints
          .map((candidate, index) => ({ index, d: distSq(p.x, p.y, candidate.x, candidate.y) }))
          .filter((candidate) => candidate.index !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 5)
          .map((candidate) => candidate.index);
        p.close = nearest;
      }

      points = nextPoints;
    };

    const draw = (time: number) => {
      const t = time * 0.001;
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];
        point.x = point.originX + Math.cos(t * point.speed + point.phase) * point.ampX * 0.28;
        point.y = point.originY + Math.sin(t * point.speed + point.phase) * point.ampY * 0.28;

        const pointerDistance = distSq(pointer.x, pointer.y, point.x, point.y);
        let alpha = 0;
        if (pointerDistance < 8000) {
          alpha = 0.35;
        } else if (pointerDistance < 26000) {
          alpha = 0.14;
        } else if (pointerDistance < 52000) {
          alpha = 0.05;
        }

        if (alpha > 0) {
          for (let j = 0; j < point.close.length; j += 1) {
            const neighbor = points[point.close[j]];
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            context.stroke();
          }

          context.beginPath();
          context.arc(point.x, point.y, point.size, 0, Math.PI * 2, false);
          context.fillStyle = `rgba(6, 182, 212, ${alpha + 0.08})`;
          context.fill();
        }
      }

      rafId = window.requestAnimationFrame(draw);
    };

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onResize = () => buildGraph();

    buildGraph();
    rafId = window.requestAnimationFrame(draw);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(124,58,237,0.22)_0%,rgba(6,182,212,0.08)_38%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
}
