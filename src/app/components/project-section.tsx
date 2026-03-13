"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Globe,
  Lock,
  Sparkles,
  Unlock,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";

type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  repoVisibility: "public" | "private";
  repoUrl?: string;
  websiteUrl?: string;
  privateNote?: string;
  images?: string[];
  previewImages?: string[];
  proofUrl?: string;
  proofLabel?: string;
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
      "A comprehensive betting management system built with Laravel, featuring real-time updates, transaction management, and automated workflows that boosted operational efficiency by 100%.",
    tags: ["PHP", "Laravel", "MySQL", "JavaScript", "WebSockets"],
    repoVisibility: "private",
    websiteUrl: "https://claw-main-lnj1oh.free.laravel.cloud",
    privateNote: "Private (client repository)",
    images: CLAW_IMAGES,
    previewImages: CLAW_IMAGES.slice(0, 3),
  },
  {
    title: "TeachRater - Teacher Evaluation System",
    subtitle: "AI-Integrated Evaluation Platform",
    description:
      "Built to bridge the gap between manual assessment and digital efficiency, this system provides a systematic approach to institutional feedback. By leveraging AI-powered integration to process qualitative data, the platform improved operational efficiency by 60%, allowing for faster, more accurate faculty evaluations while ensuring a seamless experience for thousands of users.",
    tags: ["Laravel", "OpenAI API", "HTML", "CSS", "JavaScript"],
    repoVisibility: "private",
    websiteUrl: "https://evaluation.holycross.edu.ph",
    privateNote: "Private (client repository)",
    proofUrl:
      "https://news.holycross.edu.ph/empowering-voices-enhancing-quality-hcc-opens-student-teacher-evaluations-for-ay-2025-2026/",
    proofLabel: "See more",
    images: TEACH_RATER_IMAGES,
    previewImages: TEACH_RATER_IMAGES.slice(0, 3),
  },
  {
    title: "Health & Nutrition Management System",
    subtitle: "Capstone Project 2019",
    description:
      "A comprehensive health tracking system (Capstone Project 2019) built with pure PHP, featuring BMI calculator, meal pattern management, and health record tracking.",
    tags: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    repoVisibility: "private",
    privateNote: "Private repository",
    images: HEALTH_NUT_IMAGES,
    previewImages: HEALTH_NUT_IMAGES.slice(0, 3),
  },
  {
    title: "Estatein Real Estate Wordpress Theme",
    subtitle: "WordPress Theme Development",
    description:
      "A professional WordPress theme built for real estate businesses, agencies, and property showcase websites.",
    tags: ["WordPress", "PHP", "CSS", "HTML", "JavaScript"],
    repoVisibility: "public",
    repoUrl: "https://github.com/jeromeestebanofficial/real-state-wp-theme",
    websiteUrl: "https://real-state-theme.42web.io",
  },
  {
    title: "Pyrotechnic Portfolio Website",
    subtitle: "Compliance + Operations Hub",
    description:
      "A minimalist, static business portfolio designed for a specialized Pyrotechnics and Event Lighting firm. The goal was to take a traditionally \"loud\" and \"flashy\" industry and present it through a lens of professional reliability and modern design.",
    tags: ["Next.js", "HTML", "CSS", "Tailwind"],
    repoVisibility: "private",
    websiteUrl: "https://pyrotechnics.vercel.app/",
    privateNote: "Private (for sale)",
  },
  {
    title: "NextJS Portfolio",
    subtitle: "Personal Portfolio",
    description:
      "A simple, interactive space built with Next.js to showcase my latest projects and technical journey. Focused on clean design and smooth performance.",
    tags: ["Next.js", "HTML", "Tailwind"],
    repoVisibility: "public",
    repoUrl: "https://github.com/jeromeestebanofficial/nextjs-porfolio.git",
    websiteUrl: "https://estebanjerome.vercel.app/",
  },
];

function MagneticButton({
  href,
  label,
  icon,
  disabledLabel,
  tooltip,
}: {
  href?: string;
  label: string;
  icon: ReactNode;
  disabledLabel?: string;
  tooltip?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.6 });

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.14);
    y.set(dy * 0.14);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!href) {
    return (
      <span className="group relative inline-flex">
        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-500">
          {icon}
          {disabledLabel ?? label}
        </span>
        {tooltip ? (
          <span className="pointer-events-none absolute -top-10 left-1/2 z-[90] hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black/90 px-2.5 py-1 text-[11px] font-medium text-zinc-100 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:block">
            {tooltip}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className="group relative inline-flex items-center gap-2 rounded-full border border-cyan-300/45 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 backdrop-blur-xl"
    >
      {icon}
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-75" />
      {tooltip ? (
        <span className="pointer-events-none absolute -top-10 left-1/2 z-[90] hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black/90 px-2.5 py-1 text-[11px] font-medium text-zinc-100 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:block">
          {tooltip}
        </span>
      ) : null}
    </motion.a>
  );
}

function PreviewPane({ project }: { project: ProjectItem }) {
  const stack = (project.previewImages ?? []).slice(0, 3);
  const [stackSources, setStackSources] = useState<(string | null)[]>(stack);
  const [hoveredStackIndex, setHoveredStackIndex] = useState<number | null>(null);

  useEffect(() => {
    setStackSources((project.previewImages ?? []).slice(0, 3));
    setHoveredStackIndex(null);
  }, [project.previewImages, project.title]);

  const visibleSlides = stackSources.filter((item): item is string => Boolean(item));

  if (visibleSlides.length > 0) {
    const transforms =
      visibleSlides.length === 1
        ? ["translate(-50%, -50%) translate(0px, 0px) rotate(0deg)"]
        : visibleSlides.length === 2
          ? [
              "translate(-50%, -50%) translate(-54px, 8px) rotate(-9deg)",
              "translate(-50%, -50%) translate(54px, 8px) rotate(9deg)",
            ]
          : [
              "translate(-50%, -50%) translate(-76px, 10px) rotate(-11deg)",
              "translate(-50%, -50%) translate(0px, -1px) rotate(0deg)",
              "translate(-50%, -50%) translate(76px, 10px) rotate(11deg)",
            ];
    const zIndexes = visibleSlides.length === 1 ? [30] : visibleSlides.length === 2 ? [20, 24] : [18, 30, 22];

    return (
      <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(244,114,182,0.16),transparent_45%),linear-gradient(145deg,#111,#0a0a0a)] lg:h-full">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_1px,transparent_1px,transparent_18px),repeating-linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_1px,transparent_1px,transparent_18px)] opacity-20" />
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {visibleSlides.map((src, index) => {
            const isHovered = hoveredStackIndex === index;
            const baseTransform = transforms[index] ?? transforms[0];
            const hoverTransform = `${baseTransform} translateY(-8px) scale(1.04)`;
            return (
              <div
                key={`${project.title}-preview-${src}-${index}`}
                className="group absolute left-1/2 top-1/2 h-32 w-44 overflow-hidden rounded-2xl border border-white/20 bg-zinc-900/90 shadow-[0_22px_30px_rgba(0,0,0,0.45)]"
                style={{
                  transform: isHovered ? hoverTransform : baseTransform,
                  zIndex: isHovered ? 60 : (zIndexes[index] ?? 20),
                  transition:
                    "transform 220ms ease, z-index 120ms ease, box-shadow 220ms ease, border-color 220ms ease",
                }}
                onMouseEnter={() => setHoveredStackIndex(index)}
                onMouseLeave={() => setHoveredStackIndex(null)}
              >
                <Image
                  src={src}
                  alt={`${project.title} preview ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  onError={() =>
                    setStackSources((previous) =>
                      previous.map((item, previousIndex) => (previousIndex === index ? null : item)),
                    )
                  }
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.22),rgba(0,0,0,0.02))]" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(244,114,182,0.16),transparent_45%),linear-gradient(145deg,#111,#0a0a0a)] lg:h-full">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.07),rgba(255,255,255,0.07)_1px,transparent_1px,transparent_18px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_1px,transparent_1px,transparent_18px)] opacity-25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-[0.16em] text-zinc-200 uppercase backdrop-blur-xl">
          Preview Coming Soon
        </p>
      </div>
    </div>
  );
}

function StickyCard({
  project,
  active,
  cardRef,
  onOpen,
}: {
  project: ProjectItem;
  active: boolean;
  cardRef: (node: HTMLDivElement | null) => void;
  onOpen: () => void;
}) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const localScroll = useScroll({ target: localRef, offset: ["start start", "end start"] });
  const scale = useTransform(localScroll.scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(localScroll.scrollYProgress, [0, 1], [1, 0.5]);

  const publicRepoLink = project.repoVisibility === "public" ? project.repoUrl : undefined;

  return (
    <div ref={(node) => { localRef.current = node; cardRef(node); }} className="relative min-h-[82vh]">
      <motion.article
        style={{ scale, opacity }}
        className="sticky top-24 mx-auto grid min-h-[56vh] w-full max-w-5xl grid-cols-1 gap-5 rounded-3xl border border-white/10 bg-[rgba(17,17,17,0.62)] p-5 backdrop-blur-xl lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:p-7"
      >
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
            stroke="rgba(6,182,212,0.9)"
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
          />
        </motion.svg>

        <div className="relative z-10 flex flex-col">
          <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">{project.subtitle}</p>
          <h3 className="mt-2 text-xl font-bold text-zinc-100 sm:text-2xl">{project.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Explore highlights, screenshots, links, and build context in one clean view.
          </p>
          {project.proofUrl ? (
            <a
              href={project.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20"
            >
              {project.proofLabel ?? "See more"}
              <ExternalLink className="h-3.5 w-3.5 opacity-75" />
            </a>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={`${project.title}-${tag}`}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <MagneticButton href={project.websiteUrl} label="Live Preview" icon={<Globe className="h-4 w-4" />} />
            <MagneticButton
              href={publicRepoLink}
              label="GitHub Repo"
              icon={
                <span className="relative inline-flex">
                  <Github className="h-4 w-4" />
                  {project.repoVisibility === "private" ? (
                    <Lock className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-black/80 p-[1px] text-zinc-200" />
                  ) : (
                    <Unlock className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-black/80 p-[1px] text-zinc-200" />
                  )}
                </span>
              }
              disabledLabel="Private Repo"
              tooltip={
                project.repoVisibility === "private"
                  ? project.privateNote ?? "Private repository"
                  : "Public repository"
              }
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onOpen}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20"
            >
              <Sparkles className="h-4 w-4" />
              View Details
            </motion.button>
          </div>
        </div>

        <div className="relative z-10">
          <PreviewPane project={project} />
        </div>
      </motion.article>
    </div>
  );
}

function MobileCard({ project, onOpen }: { project: ProjectItem; onOpen: () => void }) {
  const publicRepoLink = project.repoVisibility === "public" ? project.repoUrl : undefined;
  return (
    <article className="grid gap-4 rounded-3xl border border-white/10 bg-[rgba(17,17,17,0.62)] p-5 backdrop-blur-xl">
      <div>
        <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">{project.subtitle}</p>
        <h3 className="mt-2 text-xl font-bold text-zinc-100">{project.title}</h3>
        <p className="mt-2 text-sm text-zinc-400">Open details for full description and gallery.</p>
        {project.proofUrl ? (
          <a
            href={project.proofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            {project.proofLabel ?? "See more"}
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          </a>
        ) : null}
      </div>
      <PreviewPane project={project} />
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={`${project.title}-mobile-${tag}`}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <MagneticButton href={project.websiteUrl} label="Live Preview" icon={<Globe className="h-4 w-4" />} />
        <MagneticButton
          href={publicRepoLink}
          label="GitHub Repo"
          icon={
            <span className="relative inline-flex">
              <Github className="h-4 w-4" />
              {project.repoVisibility === "private" ? (
                <Lock className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-black/80 p-[1px] text-zinc-200" />
              ) : (
                <Unlock className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-black/80 p-[1px] text-zinc-200" />
              )}
            </span>
          }
          disabledLabel="Private Repo"
          tooltip={
            project.repoVisibility === "private"
              ? project.privateNote ?? "Private repository"
              : "Public repository"
          }
        />
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20"
        >
          <Sparkles className="h-4 w-4" />
          View Details
        </button>
      </div>
    </article>
  );
}

function ProjectDetailsModal({
  project,
  imageIndex,
  onClose,
  onNext,
  onPrev,
}: {
  project: ProjectItem;
  imageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const images = project.images ?? [];
  const currentImage = images[imageIndex];
  const publicRepoLink = project.repoVisibility === "public" ? project.repoUrl : undefined;

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[rgba(18,18,18,0.92)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-6"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-zinc-100 transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">{project.subtitle}</p>
        <h3 className="mt-2 pr-10 text-2xl font-bold text-zinc-100">{project.title}</h3>
        <p className="mt-3 text-sm text-zinc-300 sm:text-base">{project.description}</p>
        {project.proofUrl ? (
          <a
            href={project.proofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-zinc-100 backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            {project.proofLabel ?? "See more"}
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          </a>
        ) : null}

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div className="relative h-56 w-full sm:h-72">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={`${project.title} preview ${imageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(244,114,182,0.16),transparent_45%),linear-gradient(145deg,#111,#0a0a0a)]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.22),rgba(0,0,0,0.05))]" />
          </div>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-zinc-100 backdrop-blur-lg transition-colors hover:bg-black/65"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-zinc-100 backdrop-blur-lg transition-colors hover:bg-black/65"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {images.map((_, idx) => (
              <span
                key={`${project.title}-dot-${idx}`}
                className={`h-1.5 rounded-full transition-all ${idx === imageIndex ? "w-5 bg-white" : "w-2 bg-white/35"}`}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={`${project.title}-modal-${tag}`}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <MagneticButton href={project.websiteUrl} label="Live Preview" icon={<Globe className="h-4 w-4" />} />
          <MagneticButton
            href={publicRepoLink}
            label="GitHub Repo"
            icon={
              <span className="relative inline-flex">
                <Github className="h-4 w-4" />
                {project.repoVisibility === "private" ? (
                  <Lock className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-black/80 p-[1px] text-zinc-200" />
                ) : (
                  <Unlock className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-black/80 p-[1px] text-zinc-200" />
                )}
              </span>
            }
            disabledLabel="Private Repo"
            tooltip={
              project.repoVisibility === "private"
                ? project.privateNote ?? "Private repository"
                : "Public repository"
            }
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectSection() {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const stableProjects = useMemo(() => PROJECTS, []);

  const activeImages = activeProject?.images ?? [];

  useEffect(() => {
    const onScroll = () => {
      const anchor = 150;
      let nextActive = 0;

      for (let i = 0; i < cardRefs.current.length; i += 1) {
        const card = cardRefs.current[i];
        if (!card) {
          continue;
        }
        const rect = card.getBoundingClientRect();
        if (rect.top <= anchor && rect.bottom > anchor) {
          nextActive = i;
          break;
        }
      }

      setActiveIndex(nextActive);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const openDetails = (project: ProjectItem) => {
    setActiveProject(project);
    setActiveImageIndex(0);
  };

  const closeDetails = () => {
    setActiveProject(null);
    setActiveImageIndex(0);
  };

  const nextImage = () => {
    if (activeImages.length <= 1) {
      return;
    }
    setActiveImageIndex((prev) => (prev + 1) % activeImages.length);
  };

  const prevImage = () => {
    if (activeImages.length <= 1) {
      return;
    }
    setActiveImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  return (
    <section id="projects" className="relative bg-black pb-20 pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_28px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_28px)] opacity-35" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
          <div className="relative">
            <div className="relative hidden lg:block">
              {stableProjects.map((project, index) => (
                <StickyCard
                  key={project.title}
                  project={project}
                  active={activeIndex === index}
                  onOpen={() => openDetails(project)}
                  cardRef={(node) => {
                    cardRefs.current[index] = node;
                  }}
                />
              ))}
            </div>

            <div className="relative grid grid-cols-1 gap-5 lg:hidden">
              {stableProjects.map((project) => (
                <MobileCard
                  key={`${project.title}-mobile`}
                  project={project}
                  onOpen={() => openDetails(project)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-28">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="text-[1.9rem] font-black tracking-tight text-zinc-100 sm:text-4xl md:text-[2.5rem]"
            >
              Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="max-w-xl text-sm text-zinc-400 sm:text-base"
            >
              A few projects I&apos;ve built while learning and improving, focused on shipping clean, functional experiences and solving real-world problems.
            </motion.p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  What I aim for
                </p>
                <p className="mt-1 text-sm text-zinc-200">
                  Clean design, easy navigation, and features that just work, built to help users every step of the way.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  How I improve
                </p>
                <p className="mt-1 text-sm text-zinc-200">
                  I iterate based on feedback, performance checks, and small UX details that add up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeProject ? (
          <ProjectDetailsModal
            project={activeProject}
            imageIndex={activeImageIndex}
            onClose={closeDetails}
            onNext={nextImage}
            onPrev={prevImage}
          />
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.84' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E");
          background-repeat: repeat;
          mix-blend-mode: soft-light;
        }
      `}</style>
    </section>
  );
}
