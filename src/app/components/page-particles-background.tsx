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
const LINE_COLOR = "rgba(180,180,180,0.28)";
const PROXIMITY = 128;
const DENSITY = 12000;
const DOT_RADIUS = 1.15;

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
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / DENSITY);
      particles = Array.from({ length: count }, () => createParticle());
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

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
      }

      for (let i = 0; i < particles.length; i += 1) {
        const p1 = particles[i];
        const x1 = p1.x + p1.offsetX;
        const y1 = p1.y + p1.offsetY;

        context.beginPath();
        context.fillStyle = DOT_COLOR;
        context.arc(x1, y1, DOT_RADIUS, 0, Math.PI * 2);
        context.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const p2 = particles[j];
          const x2 = p2.x + p2.offsetX;
          const y2 = p2.y + p2.offsetY;
          const dx = x1 - x2;
          const dy = y1 - y2;
          const dist = Math.hypot(dx, dy);

          if (dist < PROXIMITY) {
            const alpha = 1 - dist / PROXIMITY;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.strokeStyle = LINE_COLOR.replace("0.28", `${0.28 * alpha}`);
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    const onMouseMove = (event: MouseEvent) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onMouseLeave = () => {
      pointer.active = false;
    };

    const onResize = () => setup();

    setup();
    frameRef.current = window.requestAnimationFrame(draw);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
