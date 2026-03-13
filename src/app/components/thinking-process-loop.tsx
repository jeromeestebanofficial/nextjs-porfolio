"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Cpu, DatabaseZap, Eye, Layers3, CornerLeftUp } from "lucide-react";

type Step = {
  id: "observe" | "visualize" | "gather" | "action";
  title: "Observe" | "Visualize" | "Gather Data" | "Take Action";
  description: string;
  Icon: typeof Eye;
  accent: "cyan" | "violet";
};

function useTypewriter(text: string, active: boolean, speedMs = 16) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    setCount(0);
    let raf = 0;
    let last = 0;

    const tick = (t: number) => {
      if (!last) last = t;
      const elapsed = t - last;
      if (elapsed >= speedMs) {
        setCount((prev) => (prev >= text.length ? prev : prev + 1));
        last = t;
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, speedMs, text.length]);

  return text.slice(0, count);
}

function MagneticIcon({
  children,
  strength = 14,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.2 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.2 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const nx = Math.max(-1, Math.min(1, dx / (r.width / 2)));
        const ny = Math.max(-1, Math.min(1, dy / (r.height / 2)));
        mx.set(nx * strength);
        my.set(ny * strength);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StepCard({
  step,
  index,
}: {
  step: Step;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.55, margin: "-10% 0px -20% 0px" });
  const typed = useTypewriter(step.description, inView, 14);

  const side = index % 2 === 0 ? "left" : "right";
  const align =
    side === "left"
      ? "lg:justify-self-start lg:pr-10"
      : "lg:justify-self-end lg:pl-10";

  const cardEnter =
    side === "left"
      ? { opacity: 1, y: 0, x: 0 }
      : { opacity: 1, y: 0, x: 0 };

  const cardInitial = side === "left" ? { opacity: 0, y: 14, x: -10 } : { opacity: 0, y: 14, x: 10 };

  const glowClass =
    step.accent === "cyan"
      ? "shadow-[0_0_0px_rgba(6,182,212,0.0)]"
      : "shadow-[0_0_0px_rgba(124,58,237,0.0)]";

  const wakeGlow =
    step.accent === "cyan"
      ? "drop-shadow-[0_0_16px_rgba(6,182,212,0.55)]"
      : "drop-shadow-[0_0_16px_rgba(124,58,237,0.55)]";

  const iconBg =
    step.accent === "cyan"
      ? "bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.22),transparent_60%)]"
      : "bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.22),transparent_60%)]";

  const Icon = step.Icon;

  return (
    <div className={`relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] ${align}`}>
      <div className={`hidden lg:block ${side === "left" ? "" : "order-3"}`} />

      <div className="relative hidden lg:flex items-center justify-center">
        <div className="h-4 w-4 rounded-full border border-white/15 bg-white/8 backdrop-blur-xl" />
      </div>

      <motion.div
        ref={ref}
        initial={cardInitial}
        whileInView={cardEnter}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative lg:col-span-1 ${side === "left" ? "lg:col-start-1" : "lg:col-start-3"}`}
      >
        <div className="pointer-events-none absolute -inset-8 opacity-0 blur-2xl transition-opacity duration-500 lg:opacity-100" />
        <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5 ${glowClass}`}>
          <div className="pointer-events-none absolute inset-[-40%] opacity-55 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

          <div className="relative flex items-start gap-3">
            <MagneticIcon className="shrink-0">
              <motion.div
                className={`relative grid h-12 w-12 place-items-center rounded-xl border border-white/12 bg-black/35 backdrop-blur-xl ${iconBg}`}
                animate={
                  step.id === "observe"
                    ? {
                        scaleY: [1, 1, 0.1, 1, 1],
                      }
                    : step.id === "action"
                      ? {
                          boxShadow: [
                            "0 0 0px rgba(6,182,212,0.0)",
                            "0 0 18px rgba(6,182,212,0.25)",
                            "0 0 0px rgba(6,182,212,0.0)",
                          ],
                        }
                      : undefined
                }
                transition={
                  step.id === "observe"
                    ? { duration: 7.5, repeat: Infinity, times: [0, 0.6, 0.62, 0.66, 1], ease: "easeInOut" }
                    : step.id === "action"
                      ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                }
              >
                <motion.div
                  animate={inView ? { opacity: 1, filter: "brightness(1.2)" } : { opacity: 0.75, filter: "brightness(1)" }}
                  className={`${inView ? wakeGlow : ""}`}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Icon size={32} className="text-zinc-100" />
                </motion.div>
              </motion.div>
            </MagneticIcon>

            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-400">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                {typed}
                <span className="inline-block w-2 align-baseline text-zinc-500">
                  {inView && typed.length < step.description.length ? "|" : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ThinkingProcessLoop() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pulseY = useTransform(scrollYProgress, [0, 1], ["6%", "92%"]);
  const pulseOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "observe",
        title: "Observe",
        Icon: Eye,
        accent: "cyan",
        description: "Observe – I notice the problem and curiosity kicks in.",
      },
      {
        id: "visualize",
        title: "Visualize",
        Icon: Layers3,
        accent: "violet",
        description: "Visualize – I imagine possible solutions.",
      },
      {
        id: "gather",
        title: "Gather Data",
        Icon: DatabaseZap,
        accent: "cyan",
        description: "Gather Data – I research, plan, and let creativity guide the process.",
      },
      {
        id: "action",
        title: "Take Action",
        Icon: Cpu,
        accent: "violet",
        description: "Take Action – I build and test solutions.",
      },
    ],
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="thinking"
      className="relative scroll-mt-24 py-10 sm:py-14"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-300/90" />
            How I Think
          </div>
          <h2 className="text-[1.9rem] font-black tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
            How I Think
          </h2>
          <p className="max-w-xl text-sm text-zinc-400 sm:text-base">
            I like to slow down just enough to understand the real problem, then move quickly and iteratively toward something that works and feels right.
          </p>

          <div className="mt-4 grid gap-3 text-sm text-zinc-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                What this means
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                I don&apos;t just jump into code; I look at context, constraints, and the people using the product before choosing an approach.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                How it feels in projects
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                Each loop through this process makes the design cleaner, the UX clearer, and the implementation more predictable and maintainable.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                Where it shows up
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                From debugging tricky edge cases to designing new features, I reuse this loop to stay focused, calm, and intentional.
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/25 to-transparent lg:left-1/2 lg:-translate-x-1/2" />

          <motion.div
            aria-hidden
            style={{ top: pulseY, opacity: pulseOpacity }}
            className="pointer-events-none absolute left-4 lg:left-1/2 lg:-translate-x-1/2"
          >
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.32),transparent_60%)] blur-xl" />
              <div className="absolute inset-0 h-9 w-9 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.26),transparent_62%)] blur-xl" />
              <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.75)]" />
            </div>
          </motion.div>

          <div className="mt-2 space-y-4 lg:space-y-6">
            {steps.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-zinc-400">
            <CornerLeftUp className="h-4 w-4 text-zinc-300" />
            <span>Refine &amp; Repeat // The cycle continues.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThinkingProcessLoop;

