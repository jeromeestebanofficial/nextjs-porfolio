"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  size: number;
  color: string;
  phase: number;
};

const TITLE = "JEROME";
const SUBTITLE =
  "Full-Stack Developer specializing in building scalable web applications and intuitive APIs.";
const VIOLET = "#7C3AED";
const CYAN = "#06B6D4";
const SIM_PADDING = 120;
const MAX_PARTICLES = 1200;
const REPULSE_RADIUS = 105;
const REPULSE_RADIUS_SQ = REPULSE_RADIUS * REPULSE_RADIUS;

export function ParticleText() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const width = Math.max(320, Math.floor(entry.contentRect.width));
      const height = width < 768 ? 150 : 190;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(size.width * dpr);
    canvas.height = Math.floor(size.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const simWidth = size.width + SIM_PADDING * 2;
    const simHeight = size.height + SIM_PADDING * 2;

    const offscreen = document.createElement("canvas");
    offscreen.width = simWidth;
    offscreen.height = simHeight;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) {
      return;
    }

    let fontSize = Math.floor(Math.max(62, Math.min(size.width * 0.18, size.width < 768 ? 108 : 162)));
    const baselineY = simHeight * 0.48;
    const startX = SIM_PADDING + 22;
    offCtx.font = `900 ${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
    while (offCtx.measureText(TITLE).width > size.width * 0.95 && fontSize > 48) {
      fontSize -= 4;
      offCtx.font = `900 ${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
    }

    offCtx.clearRect(0, 0, simWidth, simHeight);
    offCtx.fillStyle = "#ffffff";
    offCtx.textAlign = "left";
    offCtx.textBaseline = "middle";
    offCtx.fillText(TITLE, startX, baselineY);

    const image = offCtx.getImageData(0, 0, simWidth, simHeight);
    const pixels = image.data;
    const spacing = size.width < 768 ? 4 : 5;
    const nextParticles: Particle[] = [];

    for (let y = 0; y < simHeight; y += spacing) {
      for (let x = 0; x < simWidth; x += spacing) {
        const alpha = pixels[(y * simWidth + x) * 4 + 3];
        if (alpha > 60) {
          const colorMix = Math.random();
          nextParticles.push({
            x: Math.random() * simWidth,
            y: Math.random() * simHeight,
            vx: 0,
            vy: 0,
            homeX: x,
            homeY: y,
            size: 2 + Math.random() * 1.9,
            color: colorMix > 0.5 ? VIOLET : CYAN,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    if (nextParticles.length < 120) {
      for (let i = 0; i < 420; i += 1) {
        const angle = (i / 420) * Math.PI * 2;
        const radius = Math.min(size.width, size.height) * 0.18 + (i % 11);
        nextParticles.push({
          x: Math.random() * simWidth,
          y: Math.random() * simHeight,
          vx: 0,
          vy: 0,
          homeX: SIM_PADDING + size.width * 0.5 + Math.cos(angle) * radius,
          homeY: SIM_PADDING + size.height * 0.5 + Math.sin(angle) * radius * 0.45,
          size: 1.8 + Math.random() * 1.4,
          color: i % 2 === 0 ? VIOLET : CYAN,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    if (nextParticles.length > MAX_PARTICLES) {
      const step = nextParticles.length / MAX_PARTICLES;
      const reduced: Particle[] = [];
      for (let i = 0; i < MAX_PARTICLES; i += 1) {
        reduced.push(nextParticles[Math.floor(i * step)]);
      }
      particlesRef.current = reduced;
    } else {
      particlesRef.current = nextParticles;
    }
    const particles = particlesRef.current;

    const guideCanvas = document.createElement("canvas");
    guideCanvas.width = size.width;
    guideCanvas.height = size.height;
    const guideCtx = guideCanvas.getContext("2d");
    if (!guideCtx) {
      return;
    }
    guideCtx.font = `900 ${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
    guideCtx.textAlign = "left";
    guideCtx.textBaseline = "middle";
    const guideGradient = guideCtx.createLinearGradient(startX, 0, startX + size.width * 0.55, 0);
    guideGradient.addColorStop(0, "rgba(124,58,237,0.2)");
    guideGradient.addColorStop(1, "rgba(6,182,212,0.2)");
    guideCtx.fillStyle = guideGradient;
    guideCtx.fillText(TITLE, startX - SIM_PADDING, baselineY - SIM_PADDING);

    const animate = (time: number) => {
      context.clearRect(0, 0, size.width, size.height);
      context.drawImage(guideCanvas, 0, 0);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        const toHomeX = p.homeX - p.x;
        const toHomeY = p.homeY - p.y;
        p.vx += toHomeX * 0.032;
        p.vy += toHomeY * 0.032;

        // Keeps particles alive while text is assembled.
        p.vx += Math.sin(time * 0.0022 + p.phase) * 0.015;
        p.vy += Math.cos(time * 0.002 + p.phase) * 0.015;

        if (pointerRef.current.active) {
          const dx = p.x - pointerRef.current.x;
          const dy = p.y - pointerRef.current.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < REPULSE_RADIUS_SQ && distanceSq > 0.0001) {
            const distance = Math.sqrt(distanceSq);
            const force = (1 - distance / REPULSE_RADIUS) * 1.55;
            p.vx += (dx / distance) * force;
            p.vy += (dy / distance) * force;
          }
        }

        p.vx *= 0.885;
        p.vy *= 0.885;
        p.x += p.vx;
        p.y += p.vy;

        context.beginPath();
        context.fillStyle = p.color;
        context.shadowColor = p.color;
        context.shadowBlur = 8;
        context.arc(p.x - SIM_PADDING, p.y - SIM_PADDING, p.size, 0, Math.PI * 2);
        context.fill();
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      context.clearRect(0, 0, size.width, size.height);
    };
  }, [size.height, size.width]);

  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - rect.left + SIM_PADDING;
    pointerRef.current.y = event.clientY - rect.top + SIM_PADDING;
    pointerRef.current.active = true;
  };

  const onMouseLeave = () => {
    pointerRef.current.active = false;
  };

  return (
    <div ref={wrapperRef} className="w-full">
      <p className="mb-0 text-base font-medium tracking-wide text-zinc-300 sm:text-lg">Hi, I&apos;m</p>
      <h1 className="sr-only">{TITLE}</h1>
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        className="block h-[150px] w-full md:h-[190px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 94%, transparent 100%)",
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      <p className="mt-0 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
        {SUBTITLE}
      </p>
    </div>
  );
}
