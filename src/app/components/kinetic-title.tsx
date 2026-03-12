"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo, useState, type MouseEvent } from "react";

const DISPLAY_NAME = "JEROME";
const ALIASES = ["NEWTON", "NEXUS", "NEURAL", "NOVA"];
const SUBTITLE =
  "Full-Stack Developer specializing in building scalable web applications and intuitive APIs.";

export function KineticTitle() {
  const [isHovered, setIsHovered] = useState(false);
  const subtitleWords = useMemo(() => SUBTITLE.split(" "), []);
  const letters = useMemo(() => DISPLAY_NAME.split(""), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 110, damping: 20, mass: 0.9 });
  const springY = useSpring(mouseY, { stiffness: 110, damping: 20, mass: 0.9 });

  const rotateY = useTransform(springX, [-40, 40], [-4, 4]);
  const rotateX = useTransform(springY, [-30, 30], [3, -3]);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    mouseX.set(dx * 0.12);
    mouseY.set(dy * 0.1);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="flex w-full flex-col items-start justify-center text-left [perspective:1200px]"
      style={{ rotateX, rotateY }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mb-1 text-base font-medium tracking-wide text-zinc-300 sm:text-lg"
      >
        Hi, I&apos;m
      </motion.p>

      <div className="relative inline-block max-w-full">
        <motion.h1
          className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-6xl font-black leading-[0.92] tracking-tighter text-transparent sm:text-7xl md:text-8xl lg:text-9xl"
          animate={{
            filter: [
              "drop-shadow(0 0 10px rgba(124,58,237,0.2))",
              "drop-shadow(0 0 15px rgba(124,58,237,0.4))",
              "drop-shadow(0 0 10px rgba(124,58,237,0.2))",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {letters.map((char, index) => {
            const center = (letters.length - 1) / 2;
            const distance = index - center;
            return (
              <motion.span
                key={`${char}-${index}`}
                className="inline-block"
                animate={
                  isHovered
                    ? {
                        x: distance * 7,
                        y: index % 2 === 0 ? -10 : 10,
                        opacity: 0.34,
                      }
                    : { x: 0, y: 0, opacity: 1 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {char}
              </motion.span>
            );
          })}
        </motion.h1>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute -bottom-14 left-0 flex flex-wrap gap-2"
            >
              {ALIASES.map((alias, index) => (
                <motion.span
                  key={alias}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.32, delay: index * 0.06 }}
                  className="rounded-full border border-cyan-300/35 bg-black/35 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-cyan-200 backdrop-blur-sm"
                >
                  {alias}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
        {subtitleWords.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="mr-1.5 inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.32 + index * 0.05 }}
          >
            {word}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
}
