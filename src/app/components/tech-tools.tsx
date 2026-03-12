"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, type CSSProperties, type MouseEvent } from "react";

type ToolTile = {
  name: string;
  logo: string;
  area: string;
  size: "large" | "medium" | "small";
};

const TOOLS: ToolTile[] = [
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    area: "node",
    size: "large",
  },
  {
    name: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    area: "next",
    size: "large",
  },
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    area: "docker",
    size: "medium",
  },
  {
    name: "MySQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    area: "mysql",
    size: "medium",
  },
  {
    name: "GitHub",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    area: "github",
    size: "medium",
  },
  {
    name: "PHP",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    area: "php",
    size: "small",
  },
  {
    name: "Laravel",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    area: "laravel",
    size: "small",
  },
  {
    name: "Express.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    area: "express",
    size: "small",
  },
];

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function useCardSpotlight() {
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({
    "--spot-x": "50%",
    "--spot-y": "50%",
    "--spot-opacity": 0,
  } as CSSProperties);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOverlayStyle({
      "--spot-x": `${x}%`,
      "--spot-y": `${y}%`,
      "--spot-opacity": 1,
    } as CSSProperties);
  };

  const onLeave = () => {
    setOverlayStyle((previous) => ({ ...previous, "--spot-opacity": 0 } as CSSProperties));
  };

  return { overlayStyle, onMove, onLeave };
}

function ToolCard({ tool }: { tool: ToolTile }) {
  const { overlayStyle, onMove, onLeave } = useCardSpotlight();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 260, damping: 20, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 260, damping: 20, mass: 0.6 });

  const rotateY = useTransform(springX, [-45, 45], [-5, 5]);
  const rotateX = useTransform(springY, [-45, 45], [5, -5]);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    pointerX.set(dx * 0.2);
    pointerY.set(dy * 0.2);
    onMove(event);
  };

  const onMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    onLeave();
  };

  return (
    <motion.article
      variants={tileVariants}
      className={`tool-card area-${tool.area}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...overlayStyle }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      <div className="spotlight-layer" aria-hidden />
      <div className="sheen-layer" aria-hidden />
      <div className="relative z-10 flex h-full items-end justify-between">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">{tool.size}</p>
          <p className="text-base font-medium text-zinc-100 sm:text-lg">{tool.name}</p>
        </div>
        <div className="tool-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tool.logo} alt={`${tool.name} logo`} loading="lazy" />
        </div>
      </div>
    </motion.article>
  );
}

export function TechTools() {
  return (
    <section id="tools" className="relative w-full overflow-hidden bg-[#000000] py-20">
      <div className="noise-layer pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={gridVariants}
          className="space-y-8"
        >
          <motion.h2 variants={tileVariants} className="text-2xl font-semibold text-white sm:text-3xl">
            Tech Tools
          </motion.h2>

          <motion.div variants={gridVariants} className="tools-bento-grid">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E");
          background-repeat: repeat;
          mix-blend-mode: soft-light;
          opacity: 0.34;
        }

        .tools-bento-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-template-areas:
            "node node node node node node next next next next next next"
            "docker docker docker mysql mysql mysql github github github php laravel express";
        }

        .tool-card {
          position: relative;
          min-height: 140px;
          border-radius: 1rem;
          padding: 1.1rem;
          overflow: hidden;
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 16px 26px rgba(0, 0, 0, 0.45);
        }

        .spotlight-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          opacity: var(--spot-opacity, 0);
          transition: opacity 180ms ease;
          background: radial-gradient(
            220px circle at var(--spot-x, 50%) var(--spot-y, 50%),
            rgba(255, 255, 255, 0.22),
            rgba(255, 255, 255, 0.08) 42%,
            rgba(255, 255, 255, 0.02) 58%,
            transparent 80%
          );
          mask-image: radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, black 72%, transparent 100%);
        }

        .sheen-layer {
          position: absolute;
          inset: -40%;
          pointer-events: none;
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            rgba(255, 255, 255, 0.18) 48%,
            rgba(255, 255, 255, 0.05) 66%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-65%) rotate(10deg);
          animation: sheenMove 9s ease-in-out infinite;
        }

        .tool-logo {
          border-radius: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.08);
          padding: 0.55rem;
          backdrop-filter: blur(10px);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tool-logo img {
          width: 23px;
          height: 23px;
          object-fit: contain;
          filter: grayscale(1) brightness(1.2);
          opacity: 0.95;
        }

        .area-node {
          grid-area: node;
          min-height: 170px;
        }
        .area-next {
          grid-area: next;
          min-height: 170px;
        }
        .area-docker {
          grid-area: docker;
        }
        .area-mysql {
          grid-area: mysql;
        }
        .area-github {
          grid-area: github;
        }
        .area-php {
          grid-area: php;
          min-height: 140px;
        }
        .area-laravel {
          grid-area: laravel;
          min-height: 140px;
        }
        .area-express {
          grid-area: express;
          min-height: 140px;
        }

        @keyframes sheenMove {
          0%,
          20% {
            transform: translateX(-72%) rotate(10deg);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          62% {
            transform: translateX(102%) rotate(10deg);
            opacity: 0;
          }
          100% {
            transform: translateX(102%) rotate(10deg);
            opacity: 0;
          }
        }

        @media (max-width: 1024px) {
          .tools-bento-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            grid-template-areas:
              "node node node next next next"
              "docker docker mysql mysql github github"
              "php php laravel laravel express express";
          }
        }

        @media (max-width: 680px) {
          .tools-bento-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-areas:
              "node node"
              "next next"
              "docker mysql"
              "github php"
              "laravel express";
          }

          .tool-card {
            min-height: 132px;
          }
        }
      `}</style>
    </section>
  );
}
