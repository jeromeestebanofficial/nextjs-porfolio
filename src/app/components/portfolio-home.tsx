"use client";

import Link from "next/link";
import Lenis from "lenis";
import {
  Bot,
  Braces,
  Code2,
  Container,
  Database,
  FileCode2,
  Github,
  Layers3,
  Network,
  Palette,
  ServerCog,
  Sparkles,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { HeroOverlay } from "./hero-overlay";
import { Projects } from "./projects";
import { ContactForm } from "./contact-form";
import { PageParticlesBackground } from "./page-particles-background";

type TechTool = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  short: string;
};

const tools: TechTool[] = [
  { name: "HTML", icon: FileCode2, short: "HT" },
  { name: "CSS", icon: Palette, short: "CS" },
  { name: "JavaScript", icon: Braces, short: "JS" },
  { name: "Next.js", icon: Sparkles, short: "NX" },
  { name: "Node.js", icon: ServerCog, short: "ND" },
  { name: "Express.js", icon: Network, short: "EX" },
  { name: "PHP", icon: Code2, short: "PH" },
  { name: "Laravel", icon: Layers3, short: "LV" },
  { name: "MySQL", icon: Database, short: "MY" },
  { name: "Python", icon: Bot, short: "PY" },
  { name: "Docker", icon: Container, short: "DK" },
  { name: "GitHub", icon: Github, short: "GH" },
];

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "tools", label: "Tech Tools" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]["id"];

function useSpotlight() {
  const [style, setStyle] = useState<CSSProperties>({
    "--spot-x": "50%",
    "--spot-y": "50%",
    "--spot-opacity": 0,
  } as CSSProperties);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setStyle({
      "--spot-x": `${x}%`,
      "--spot-y": `${y}%`,
      "--spot-opacity": 1,
    } as CSSProperties);
  };

  const onMouseLeave = () => {
    setStyle((previous) => ({ ...previous, "--spot-opacity": 0 } as CSSProperties));
  };

  return { style, onMouseMove, onMouseLeave };
}

function FlipHeading({ text }: { text: string }) {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ rotateX: -90, y: 18, opacity: 0 }}
          whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.45, delay: index * 0.025, ease: "easeOut" }}
          style={{ transformOrigin: "50% 100%" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h2>
  );
}

function BentoTile({ tool }: { tool: TechTool }) {
  const { style, onMouseLeave, onMouseMove } = useSpotlight();
  const Icon = tool.icon;

  return (
    <motion.article
      className="bento-tile"
      style={style}
      variants={itemVariant}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative z-10 flex items-center gap-4">
        <div className="bento-icon-chip rounded-xl border border-white/20 bg-white/10 p-3 text-zinc-100">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-medium text-zinc-100">{tool.name}</p>
          <p className="mt-0.5 text-xs tracking-[0.2em] text-zinc-400">{tool.short}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function PortfolioHome() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.05,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const anchorLine = window.innerHeight * 0.32;

      for (let index = NAV_ITEMS.length - 1; index >= 0; index -= 1) {
        const sectionId = NAV_ITEMS[index].id;
        const section = document.getElementById(sectionId);
        if (!section) {
          continue;
        }
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchorLine && rect.bottom > anchorLine) {
          setActiveSection(sectionId);
          return;
        }
      }

      setActiveSection("hero");
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <main className="relative isolate overflow-x-clip bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <PageParticlesBackground />
      </div>
      <div className="noise-overlay pointer-events-none fixed inset-0 z-40 opacity-30" />

      <div className="relative z-10">
        <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <nav className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/45 p-1.5 backdrop-blur-2xl">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    isActive ? "text-white" : "text-zinc-200 hover:text-white"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="active-header-indicator"
                      className="absolute inset-0 -z-10 rounded-full border border-white/20 bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <section
          id="hero"
          className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-5 py-10 sm:px-8"
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/35" />
          <HeroOverlay />
        </section>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-16 pt-12 md:px-10 md:pt-16">
          <motion.section
            id="tools"
            className="space-y-7"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.24 }}
          >
            <motion.div variants={itemVariant}>
              <FlipHeading text="Tech Tools" />
              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                The technologies I use to bring ideas to life. From frontend design to backend
                logic, these are the tools I trust to build stable and helpful web applications.
              </p>
            </motion.div>
            <motion.div className="bento-grid" variants={sectionVariant}>
              {tools.map((tool) => (
                <BentoTile key={tool.name} tool={tool} />
              ))}
            </motion.div>
          </motion.section>
        </div>

        <Projects />

        <ContactForm />

        <footer className="relative border-t border-white/10 bg-black/65 py-10">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-100">Jerome</h3>
                <p className="mt-2 max-w-xs text-sm text-zinc-400">
                  Full-Stack Developer focused on scalable systems, clean product experience, and
                  modern web architecture.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-300">
                  Quick Links
                </h4>
                <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
                  <Link href="#hero" className="transition-colors hover:text-zinc-100">
                    Home
                  </Link>
                  <Link href="#tools" className="transition-colors hover:text-zinc-100">
                    Tech Tools
                  </Link>
                  <Link href="#projects" className="transition-colors hover:text-zinc-100">
                    Projects
                  </Link>
                  <Link href="#contact" className="transition-colors hover:text-zinc-100">
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-300">
                  Contact
                </h4>
                <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
                  <a
                    href="mailto:jeromesteban.dev@gmail.com"
                    className="break-all transition-colors hover:text-zinc-100"
                  >
                    jeromesteban.dev@gmail.com
                  </a>
                  <span>Available for freelance / contract</span>
                  <span>Timezone: GMT+8</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-300">
                  Social
                </h4>
                <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-zinc-100"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-zinc-100"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://discord.com/users/YOUR_DISCORD_ID"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-zinc-100"
                  >
                    Discord
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-xs tracking-wide text-zinc-500 sm:text-sm">
                © {new Date().getFullYear()} Jerome. All rights reserved. Crafted with a modern
                monochrome glass aesthetic.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
