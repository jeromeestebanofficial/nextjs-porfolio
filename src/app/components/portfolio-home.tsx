"use client";

import Link from "next/link";
import Lenis from "lenis";
import { motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Home, Layers, FolderKanban, Mail, Brain } from "lucide-react";
import { HeroOverlay } from "./hero-overlay";
import { ProjectSection } from "./project-section";
import { ContactForm } from "./contact-form";
import { PageParticlesBackground } from "./page-particles-background";
import { TechHub3D } from "./tech-hub-3d";
import { ThinkingProcessLoop } from "./thinking-process-loop";

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
  { id: "hero", label: "Home", shortLabel: "Home", icon: Home },
  { id: "tools", label: "Tech Stack", shortLabel: "Stack", icon: Layers },
  { id: "thinking", label: "Process", shortLabel: "Process", icon: Brain },
  { id: "projects", label: "Projects", shortLabel: "Work", icon: FolderKanban },
  { id: "contact", label: "Contact", shortLabel: "Contact", icon: Mail },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]["id"];

function FlipHeading({ text }: { text: string }) {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <h2 className="text-[1.9rem] font-black tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
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

export function PortfolioHome() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || coarsePointer) {
      return;
    }

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

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: SectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }
    const rect = section.getBoundingClientRect();
    const offset = window.innerHeight * 0.12; // roughly matches scroll-mt and header height
    const targetY = rect.top + window.scrollY - offset;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

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

    let ticking = false;
    const handleScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
        <header className="pointer-events-none fixed inset-x-0 top-2.5 z-50 flex justify-center px-2 sm:top-4 sm:px-4">
          <div className="pointer-events-auto max-w-full overflow-x-auto">
            <nav className="inline-flex min-w-max items-center gap-1 rounded-full border border-white/15 bg-black/45 p-1 backdrop-blur-2xl sm:p-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => handleNavClick(event, item.id)}
                  className={`relative inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[10px] font-medium transition-colors sm:px-3 sm:text-sm ${
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
                  <Icon className="h-3.5 w-3.5 opacity-90 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            </nav>
          </div>
        </header>

        <section
          id="hero"
          className="relative flex min-h-[100svh] w-full scroll-mt-24 items-center justify-center overflow-hidden px-4 pb-10 pt-16 sm:px-8 sm:pt-10"
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/35" />
          <HeroOverlay />
        </section>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-16 pt-12 sm:px-6 md:gap-28 md:px-10 md:pt-16">
          <motion.section
            id="tools"
            className="scroll-mt-24 space-y-7"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.24 }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
              <motion.div variants={itemVariant} className="order-2 lg:order-1 h-full">
                <TechHub3D />
              </motion.div>

              <motion.div variants={itemVariant} className="order-1 lg:order-2">
                <div className="mt-4">
                  <FlipHeading text="Tech Stack &amp; Tools" />
                  <p className="mt-3 w-full text-sm text-zinc-400 sm:text-base md:max-w-none">
                    The technologies I work with to turn ideas into working web applications, always learning
                    and steadily improving.
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Frontend & UX
                    </p>
                    <p className="mt-1 text-sm text-zinc-200">
                      I build interfaces using HTML, CSS, and JavaScript as my core foundation,
                      with Bootstrap and Bulma for responsive layouts. I use Next.js to create
                      fast, structured web experiences, and try to keep designs clean, accessible,
                      and easy to navigate.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Backend & DevOps
                    </p>
                    <p className="mt-1 text-sm text-zinc-200">
                      For server-side work, I use Node.js, Express, PHP, and Laravel to build and
                      manage APIs. MySQL handles my data, and Python comes in handy for scripting
                      and utilities. I use Docker to keep environments consistent and GitHub for
                      version control and collaboration.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      Dev Tools I Rely On
                    </p>
                    <p className="mt-1 text-sm text-zinc-200">
                      Day-to-day, I work with Postman for testing APIs, FileZilla for file
                      transfers, and PuTTY for remote server access: small tools that quietly keep
                      development moving.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          <ThinkingProcessLoop />
        </div>

        <ProjectSection />

        <ContactForm />

        <footer className="relative border-t border-white/10 bg-black/65 py-10">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                © {new Date().getFullYear()} Jerome. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
