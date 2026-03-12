"use client";

import Link from "next/link";
import { Github, Linkedin, MessageCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function SocialIconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={{ scale: 0.95 }}
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.12 },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative rounded-full border border-white/20 bg-white/10 p-2.5 text-zinc-100 backdrop-blur-xl transition-colors hover:text-white sm:p-3"
      aria-label={label}
    >
      {children}
      <motion.span
        variants={{
          rest: { opacity: 0, y: 6, scale: 0.95 },
          hover: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black/75 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[0_8px_25px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:block"
      >
        {label}
      </motion.span>
    </motion.a>
  );
}

export function HeroOverlay() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10">
      <div className="grid min-h-[74svh] grid-cols-1 items-center lg:min-h-[78svh] lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative flex w-full max-w-[46rem] flex-col items-start text-left"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-14 -top-8 h-40 w-40 rounded-full bg-white/12 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 right-2 h-40 w-40 rounded-full bg-zinc-200/10 blur-3xl"
            animate={{ x: [0, -24, 0], y: [0, -18, 0], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.h1
            variants={itemVariants}
            className="relative z-10 mt-1 text-[2rem] font-black leading-[1.03] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Jerome
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="relative z-10 mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg"
          >
            Full-Stack Developer with a passion for building clean, functional web applications
            and a never-ending curiosity for how things work under the hood.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="relative z-10 mt-6 flex w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-white/8 px-2.5 py-2 backdrop-blur-xl sm:gap-3 sm:px-3">
              <SocialIconButton href="https://github.com" label="GitHub">
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </SocialIconButton>
              <SocialIconButton href="https://linkedin.com" label="LinkedIn">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </SocialIconButton>
              <SocialIconButton href="https://discord.com/users/YOUR_DISCORD_ID" label="Discord">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </SocialIconButton>
            </div>

            <div className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-3 py-2 text-[10px] leading-relaxed text-zinc-200 backdrop-blur-xl sm:rounded-full sm:text-sm">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400/90" />
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/55" />
              </span>
              <span className="whitespace-normal">Open to remote opportunities and collaboration</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative z-10 mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <motion.a
              href="#contact"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0.0)",
                  "0 0 24px rgba(255,255,255,0.45)",
                  "0 0 0px rgba(255,255,255,0.0)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex w-full justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black sm:w-auto"
            >
              Contact Me
            </motion.a>

            <Link
              href="#projects"
              className="group relative inline-flex w-full justify-center overflow-hidden rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-xl sm:w-auto"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-zinc-200/10 transition-transform duration-300 group-hover:translate-y-0" />
              Show Projects
            </Link>

            <a
              href="/Jerome-CV.pdf"
              download
              className="group relative inline-flex w-full justify-center px-5 py-3 text-sm font-semibold text-zinc-200 sm:w-auto"
            >
              Download CV
              <span className="absolute bottom-2 left-5 right-5 h-px origin-left scale-x-0 bg-zinc-100 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
          className="relative hidden h-[470px] w-full items-center justify-end lg:flex"
        >
          <motion.div
            aria-hidden
            animate={{ y: [0, -10, 0], rotate: [0, 1.2, 0] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-[370px] w-[320px]"
          >
            <div
              className="relative h-full w-full overflow-hidden border border-white/15 bg-white/8 shadow-[0_28px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              style={{ borderRadius: "58% 42% 46% 54% / 43% 37% 63% 57%" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_55%,rgba(255,255,255,0.01))]" />
              <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/14 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 right-0 h-24 w-24 rounded-full bg-white/12 blur-3xl" />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/2.gif"
                alt="Developer animation"
                className="h-auto w-[160%] max-w-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
