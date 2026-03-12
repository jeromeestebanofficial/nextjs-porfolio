"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Code2,
  Flame,
  Github,
  Globe,
  GraduationCap,
  HeartPulse,
  Home,
  Lock,
  X,
} from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";

type TechLogo = {
  name: string;
  logo: string;
};

type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  tools: TechLogo[];
  repoVisibility: "public" | "private";
  repoUrl?: string;
  websiteUrl?: string;
  images?: string[];
  privateNote?: string;
  proofUrl?: string;
  proofLabel?: string;
  fallbackTheme: "claw" | "teachrater" | "health" | "estatein" | "pyro" | "next";
};

const CLAW_IMAGES = [
  "About Page.png",
  "Accept Bet Page.png",
  "Cancel Bet Page.png",
  "Create Match Page.png",
  "Dashboard Page (Admin Side Only).png",
  "Event Management Page.png",
  "Event Matches Page.png",
  "Live Monitoring Page (Bettors View).png",
  "Login Page.png",
  "Payout Page.png",
  "Print Receipt.png",
  "Profile Management.png",
  "Remittance Page.png",
  "Report Generator Page.png",
  "Request Credit Page.png",
  "Role and Permission Management.png",
  "Send User Credit Modal.png",
  "Settings Page.png",
  "User Credit Management.png",
  "User Management Page.png",
  "Void Page.png",
].map((file) => `/claw/${encodeURIComponent(file)}`);

const TEACH_RATER_IMAGES = [
  "AI Generate Feedback Results (Evaluation Result).png",
  "AI Generate Feedback Results 2 (Evaluation Result).png",
  "Enrollment Management.png",
  "Evaluation Category Management.png",
  "Evaluation Question Management.png",
  "Evaluation Results.png",
  "Login Page.png",
  "Notification.png",
  "Peer Evaluation Page (Teacher Side).png",
  "Profile Page.png",
  "Report Page.png",
  "Review Assessment Page (Student Side).png",
  "Semester Management.png",
  "Subject Management.png",
  "Teacher Evaluation Form Page (Student Side).png",
  "Teacher Evaluation Page (Student Side).png",
  "Update Account Details Page.png",
  "Update Account Level Page.png",
  "Update Personal Detail Page.png",
  "User Management.png",
].map((file) => `/teachRater/${encodeURIComponent(file)}`);

const HEALTH_NUT_IMAGES = [
  "Account Management Page.png",
  "Add Food list Page (Admin Side).png",
  "BMI Calculator Page.png",
  "BMI Record Page.png",
  "BMI Result Page.png",
  "Calorie Food Selector Page.png",
  "Health Blood Sugar Result Page.png",
  "Home Screen Section 1.png",
  "Home Screen Section 2.png",
  "Home Screen Section 3.png",
  "Home Screen Section 4.png",
  "Home Screen Section 5.png",
  "Home Screen Section 6.png",
  "Home Screen Section 7.png",
  "Meal Pattern Page (Admin Side).png",
  "Profile Page.png",
  "Sugar Level Page.png",
].map((file) => `/healthNut/${encodeURIComponent(file)}`);

const PROJECTS: ProjectItem[] = [
  {
    title: "Claw - Cock Fighting Local Arena Wagering",
    subtitle: "Betting Management System",
    description:
      "A comprehensive betting management system with real-time updates, transaction management, and automated workflows that boosted operational efficiency by 100%.",
    tools: [
      {
        name: "PHP",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      },
      {
        name: "Laravel",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
      },
      {
        name: "MySQL",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
      {
        name: "JavaScript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "WebSockets",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg",
      },
    ],
    repoVisibility: "private",
    websiteUrl: "https://claw-main-lnj1oh.free.laravel.cloud",
    images: CLAW_IMAGES,
    privateNote: "Private (client repository)",
    fallbackTheme: "claw",
  },
  {
    title: "TeachRater - Teacher Evaluation System",
    subtitle: "AI-Integrated Evaluation Platform",
    description:
      "An automated teacher evaluation platform with AI-powered feedback integration, converting manual processes into a systematic solution that improved efficiency by 60%.",
    tools: [
      {
        name: "Laravel",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
      },
      {
        name: "OpenAI API",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg",
      },
      {
        name: "HTML",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "CSS",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        name: "JavaScript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
    ],
    repoVisibility: "private",
    websiteUrl: "https://evaluation.holycross.edu.ph",
    images: TEACH_RATER_IMAGES,
    privateNote: "Private (client repository)",
    proofUrl:
      "https://news.holycross.edu.ph/empowering-voices-enhancing-quality-hcc-opens-student-teacher-evaluations-for-ay-2025-2026/",
    proofLabel: "See More",
    fallbackTheme: "teachrater",
  },
  {
    title: "Health & Nutrition Management System",
    subtitle: "Capstone Project 2019",
    description:
      "A comprehensive health tracking system built with pure PHP, featuring a BMI calculator, meal pattern management, and health record tracking.",
    tools: [
      {
        name: "PHP",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      },
      {
        name: "MySQL",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
      {
        name: "HTML",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "CSS",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        name: "JavaScript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
    ],
    repoVisibility: "private",
    images: HEALTH_NUT_IMAGES,
    privateNote: "Private repository",
    fallbackTheme: "health",
  },
  {
    title: "Estatein Real Estate Wordpress Theme",
    subtitle: "WordPress Theme Development",
    description:
      "A professional WordPress theme built for real estate businesses, agencies, and property showcase websites.",
    tools: [
      {
        name: "WordPress",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
      },
      {
        name: "PHP",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      },
      {
        name: "CSS",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        name: "HTML",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "JavaScript",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
    ],
    repoVisibility: "public",
    repoUrl: "https://github.com/jeromeestebanofficial/real-state-wp-theme",
    websiteUrl: "https://real-state-theme.42web.io",
    privateNote: "Private repository",
    fallbackTheme: "estatein",
  },
  {
    title: "Pyrotechnic Portfolio Website",
    subtitle: "Compliance + Operations Hub",
    description:
      "Built for the pyrotechnics industry with a centralized compliance hub, multi-state data handling, and a high-performance interactive dashboard.",
    tools: [
      {
        name: "Next.js",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "HTML",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "CSS",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        name: "Tailwind",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
    ],
    repoVisibility: "private",
    websiteUrl: "http://fantasyinthesky.vercel.app",
    privateNote: "Private (for sale)",
    fallbackTheme: "pyro",
  },
  {
    title: "NextJS Portfolio",
    subtitle: "Personal Portfolio",
    description:
      "A simple, interactive space built with Next.js to showcase the latest projects and technical journey with clean design and smooth performance.",
    tools: [
      {
        name: "Next.js",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "HTML",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "Tailwind",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
    ],
    repoVisibility: "public",
    repoUrl: "https://github.com/jeromeestebanofficial/nextjs-porfolio.git",
    websiteUrl: "http://fantasyinthesky.vercel.app",
    privateNote: "Private repository",
    fallbackTheme: "next",
  },
];

const FALLBACK_THEME_STYLES = {
  claw: {
    chip: "Arena / Wagering",
    icon: BriefcaseBusiness,
    bg: "from-zinc-900 via-zinc-800 to-black",
    glow: "bg-emerald-400/20",
  },
  teachrater: {
    chip: "Evaluation / AI",
    icon: GraduationCap,
    bg: "from-zinc-900 via-slate-800 to-black",
    glow: "bg-cyan-400/20",
  },
  health: {
    chip: "Health Tracking",
    icon: HeartPulse,
    bg: "from-zinc-900 via-neutral-800 to-black",
    glow: "bg-lime-400/20",
  },
  estatein: {
    chip: "Real Estate Theme",
    icon: Home,
    bg: "from-zinc-900 via-stone-800 to-black",
    glow: "bg-indigo-400/20",
  },
  pyro: {
    chip: "Compliance Hub",
    icon: Flame,
    bg: "from-zinc-900 via-neutral-800 to-black",
    glow: "bg-amber-400/20",
  },
  next: {
    chip: "Portfolio",
    icon: Code2,
    bg: "from-zinc-900 via-slate-900 to-black",
    glow: "bg-violet-400/20",
  },
} as const;

function DefaultProjectArtwork({ project }: { project: ProjectItem }) {
  const theme = FALLBACK_THEME_STYLES[project.fallbackTheme];
  const Icon = theme.icon;

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`}>
      <div className={`pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full blur-3xl ${theme.glow}`} />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_1px,transparent_1px,transparent_16px),repeating-linear-gradient(90deg,rgba(255,255,255,0.035),rgba(255,255,255,0.035)_1px,transparent_1px,transparent_16px)] opacity-30" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] tracking-[0.12em] text-zinc-200 uppercase backdrop-blur-xl">
          {theme.chip}
        </span>

        <div className="flex items-end justify-between">
          <div className="max-w-[75%]">
            <p className="text-xs text-zinc-300/90">Default Preview</p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-100">{project.title}</p>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-zinc-100 backdrop-blur-xl">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onPointerMove,
  onPointerLeave,
  onOpen,
}: {
  project: ProjectItem;
  index: number;
  onPointerMove: (event: MouseEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  onOpen: () => void;
}) {
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 200, damping: 18, mass: 0.7 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 200, damping: 18, mass: 0.7 });
  const hasSlides = Boolean(project.images && project.images.length > 0);
  const [previewSrc, setPreviewSrc] = useState<string | null>(hasSlides ? project.images![0] : null);
  const [useFallback, setUseFallback] = useState(!hasSlides);

  const imageParallaxX = useTransform(rotateY, [-5, 5], [-12, 12]);
  const imageParallaxY = useTransform(rotateX, [-5, 5], [10, -10]);

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateYRaw.set((px - 0.5) * 10);
    rotateXRaw.set((0.5 - py) * 10);
    onPointerMove(event);
  };

  const reset = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    onPointerLeave();
  };

  return (
    <motion.article
      className="project-card relative min-h-[420px] overflow-visible rounded-3xl border border-white/10 bg-[rgba(16,16,16,0.6)] p-4 backdrop-blur-2xl hover:cursor-pointer sm:min-h-[430px] sm:p-5"
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <div className="noise-overlay-card pointer-events-none absolute inset-0 rounded-3xl" />

      <motion.svg
        className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx="5"
          fill="none"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0.55 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: index * 0.12 }}
        />
      </motion.svg>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{project.subtitle}</p>
          <h3 className="mt-3 text-xl font-bold text-zinc-100 sm:text-2xl">{project.title}</h3>
        </div>

        <div className="mt-auto space-y-4">
          <motion.div
            className="relative h-32 overflow-hidden rounded-2xl border border-white/10 bg-black/35"
            style={{ x: imageParallaxX, y: imageParallaxY }}
          >
            {!useFallback && previewSrc ? (
              <>
                <Image
                  src={previewSrc}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  quality={68}
                  className="absolute inset-0 z-[1] h-full w-full object-cover opacity-95"
                  loading="lazy"
                  onError={() => {
                    setPreviewSrc(null);
                    setUseFallback(true);
                  }}
                />
                <div className="absolute inset-0 z-[2] bg-[linear-gradient(145deg,rgba(0,0,0,0.26),rgba(0,0,0,0.05))]" />
              </>
            ) : (
              <DefaultProjectArtwork project={project} />
            )}
            <div className="absolute inset-0 z-[3] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.07),rgba(255,255,255,0.07)_1px,transparent_1px,transparent_14px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_1px,transparent_1px,transparent_14px)] opacity-25" />
          </motion.div>

          <div className="flex flex-wrap gap-2.5">
            {project.tools.map((tool) => (
              <span
                key={`${project.title}-${tool.name}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-xs text-zinc-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="h-3.5 w-3.5 object-contain grayscale brightness-150"
                  loading="lazy"
                  decoding="async"
                />
                {tool.name}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 pt-1 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-zinc-200 backdrop-blur-xl">
              <Lock className="h-3.5 w-3.5" />
              <span className="truncate">
                {project.repoVisibility === "private"
                  ? project.privateNote ?? "Private repository"
                  : "Public repository"}
              </span>
            </span>

            {project.websiteUrl ? (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20 md:w-auto"
              >
                <Globe className="h-3.5 w-3.5" />
                Live Website
              </a>
            ) : (
              <span className="group relative inline-flex w-full md:w-auto">
                <span className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-500 backdrop-blur-xl md:w-auto">
                  <Globe className="h-3.5 w-3.5" />
                  Live Preview
                </span>
                <span className="pointer-events-none absolute -top-9 left-1/2 z-[95] hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black/90 px-2 py-1 text-[11px] font-medium text-zinc-100 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:block">
                  Preview is not available
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({
  project,
  slideIndex,
  onClose,
  onNextSlide,
  onPrevSlide,
}: {
  project: ProjectItem;
  slideIndex: number;
  onClose: () => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
}) {
  const slides = project.images && project.images.length > 0 ? project.images : [];
  const currentSlide = slides[slideIndex];
  const hasSlides = slides.length > 0;
  const [modalFallback, setModalFallback] = useState(!hasSlides);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-md md:items-center md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative my-4 max-h-[calc(100svh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[rgba(18,18,18,0.9)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:my-6 sm:max-h-[90svh] sm:p-6"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-zinc-100 transition-colors hover:bg-white/20 sm:right-4 sm:top-4"
            aria-label="Close project details"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{project.subtitle}</p>
          <h3 className="mt-2 pr-10 text-xl font-bold text-zinc-100 sm:text-2xl">{project.title}</h3>
          <p className="mt-3 text-sm text-zinc-300 sm:text-base">{project.description}</p>
          {project.proofUrl ? (
            <a
              href={project.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-zinc-200 underline decoration-zinc-500 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-300"
            >
              {project.proofLabel ?? "See proof"}
            </a>
          ) : null}

          <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <div className="relative h-48 w-full sm:h-72">
              {!modalFallback && currentSlide ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.995 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <Image
                      src={currentSlide}
                      alt={`${project.title} slide ${slideIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      quality={72}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={() => setModalFallback(true)}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <DefaultProjectArtwork project={project} />
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.22),rgba(0,0,0,0.05))]" />
            </div>

            {slides.length > 1 && !modalFallback ? (
              <>
                <button
                  type="button"
                  onClick={onPrevSlide}
                  className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-zinc-100 backdrop-blur-lg transition-colors hover:bg-black/65"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onNextSlide}
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-zinc-100 backdrop-blur-lg transition-colors hover:bg-black/65"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : null}
          </div>

          {slides.length > 1 && !modalFallback ? (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {slides.map((_, index) => (
                <span
                  key={`${project.title}-dot-${index}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === slideIndex ? "w-5 bg-white" : "w-2 bg-white/35"
                  }`}
                />
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={`${project.title}-modal-${tool.name}`}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-xs text-zinc-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="h-3.5 w-3.5 object-contain grayscale brightness-150"
                  loading="lazy"
                  decoding="async"
                />
                {tool.name}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-center md:gap-2.5">
            {project.repoVisibility === "public" && project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/18 md:w-auto"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            ) : (
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-zinc-200 backdrop-blur-xl md:w-auto">
                <Lock className="h-4 w-4" />
                {project.privateNote ?? "Private repository"}
              </span>
            )}

            {project.websiteUrl ? (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/18 md:w-auto"
              >
                <Globe className="h-4 w-4" />
                Live Website
              </a>
            ) : (
              <span className="group relative inline-flex w-full md:w-auto">
                <span className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-500 backdrop-blur-xl md:w-auto">
                  <Globe className="h-4 w-4" />
                  Live Preview
                </span>
                <span className="pointer-events-none absolute -top-10 left-1/2 z-[95] hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black/90 px-2.5 py-1 text-[11px] font-medium text-zinc-100 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:block">
                  Preview is not available
                </span>
              </span>
            )}
          </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoverLight, setHoverLight] = useState({ x: 50, y: 50, active: false });
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const rect = section.getBoundingClientRect();
    setHoverLight({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  const clearPointer = () => setHoverLight((previous) => ({ ...previous, active: false }));
  const activeSlides =
    activeProject && activeProject.images && activeProject.images.length > 0
      ? activeProject.images
      : [];

  const openProject = (project: ProjectItem) => {
    setActiveProject(project);
    setActiveSlide(0);
  };

  const closeProject = () => {
    setActiveProject(null);
    setActiveSlide(0);
  };

  const nextSlide = () => {
    if (activeSlides.length <= 1) {
      return;
    }
    setActiveSlide((previous) => (previous + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    if (activeSlides.length <= 1) {
      return;
    }
    setActiveSlide((previous) => (previous - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative scroll-mt-24 bg-black pb-20 pt-20"
      onMouseLeave={clearPointer}
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30" />

      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hoverLight.active ? 1 : 0,
          background:
            "radial-gradient(320px circle at var(--x) var(--y), rgba(255,255,255,0.16), rgba(255,255,255,0.05) 42%, transparent 72%)",
          ["--x" as string]: `${hoverLight.x}%`,
          ["--y" as string]: `${hoverLight.y}%`,
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-2xl font-semibold text-zinc-100 sm:text-3xl"
        >
          Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          className="mb-8 mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base"
        >
          A collection of projects I&apos;ve built while exploring new technologies. These are a
          few pieces of work where I&apos;ve focused on solving specific problems and turning ideas
          into functional tools.
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
        }}
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 md:grid-cols-2 md:px-6 xl:grid-cols-3"
      >
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.title}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.97 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
            }}
          >
            <ProjectCard
              project={project}
              index={index}
              onPointerMove={handlePointerMove}
              onPointerLeave={clearPointer}
              onOpen={() => openProject(project)}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {activeProject ? (
          <ProjectModal
            key={activeProject.title}
            project={activeProject}
            slideIndex={activeSlide}
            onClose={closeProject}
            onNextSlide={nextSlide}
            onPrevSlide={prevSlide}
          />
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .blueprint-grid {
          background-color: #000000;
          background-image:
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.06) 0px,
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px,
              transparent 28px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px,
              transparent 28px
            );
          opacity: 0.35;
        }

        .noise-overlay-card {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.84' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E");
          background-repeat: repeat;
          mix-blend-mode: soft-light;
          opacity: 0.26;
        }

      `}</style>
    </section>
  );
}
