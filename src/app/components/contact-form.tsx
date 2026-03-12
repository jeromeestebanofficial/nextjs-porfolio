"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

type ServiceOption = "Web Development" | "System Architecture" | "Mobile Prototype" | "Other";
type SubmitState = "idle" | "loading" | "sent";

const OPTIONS: ServiceOption[] = [
  "Web Development",
  "System Architecture",
  "Mobile Prototype",
  "Other",
];

const pageVariants: Variants = {
  initial: { opacity: 0, x: 36 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.36, ease: "easeOut" } },
  exit: { opacity: 0, x: -36, transition: { duration: 0.28, ease: "easeInOut" } },
};

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const staggerItem: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: "easeOut" } },
};

function FloatingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label htmlFor={id} className="group relative block">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        placeholder=" "
        className="peer w-full rounded-2xl border border-white/15 bg-white/5 px-4 pb-3 pt-6 text-sm text-zinc-100 outline-none transition-all duration-200 focus:border-cyan-400/70 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.14)]"
      />
      <span className="pointer-events-none absolute left-4 top-4 text-xs text-zinc-400 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-3.5 peer-focus:text-xs peer-focus:text-cyan-300">
        {label}
      </span>
    </label>
  );
}

export function ContactForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [projectDetails, setProjectDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canContinue = useMemo(() => selectedService !== null, [selectedService]);

  useEffect(() => {
    if (step !== 2) {
      return;
    }
    const timeout = window.setTimeout(() => {
      const details = document.getElementById("project-details");
      details?.focus();
    }, 220);
    return () => window.clearTimeout(timeout);
  }, [step]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState !== "idle") {
      return;
    }
    if (!selectedService || !name.trim() || !email.trim() || !projectDetails.trim()) {
      setSubmitError("Please complete service, name, email, and project details.");
      return;
    }

    setSubmitState("loading");
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService,
          projectDetails,
          name,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Failed to send message.");
      }

      setSubmitState("sent");
      setProjectDetails("");
      setName("");
      setEmail("");
      setPhone("");
      setSelectedService(null);
      setStep(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setSubmitError(message);
      setSubmitState("idle");
      return;
    }

    window.setTimeout(() => {
      setSubmitState("idle");
    }, 2100);
  };

  return (
    <section id="contact" className="relative scroll-mt-24 bg-black py-16">
      <div className="noise-layer pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="contact-glass-card relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl sm:p-8 md:p-10"
        >
          <div className="sheen-layer pointer-events-none absolute inset-[-35%]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Contact Me</h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Tell me about your idea, and I will help turn it into a working product.
            </p>

            <div className="mt-7">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <p className="text-sm font-medium text-zinc-200">What do you need help with?</p>

                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {OPTIONS.map((option) => {
                        const active = selectedService === option;
                        return (
                          <motion.button
                            key={option}
                            type="button"
                            variants={staggerItem}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedService(option)}
                            className={`rounded-2xl border px-4 py-4 text-left text-sm transition-all duration-200 ${
                              active
                                ? "border-cyan-400/80 bg-cyan-400/10 text-zinc-100 shadow-[0_0_0_2px_rgba(6,182,212,0.16),0_0_28px_rgba(6,182,212,0.25)]"
                                : "border-white/15 bg-white/5 text-zinc-300 hover:border-white/30 hover:text-zinc-100"
                            }`}
                          >
                            {option}
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    <div className="flex justify-stretch sm:justify-end">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => canContinue && setStep(2)}
                        disabled={!canContinue}
                        className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="step-2"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-zinc-300">
                        Service: <span className="text-zinc-100">{selectedService}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
                      >
                        Change
                      </button>
                    </div>

                    <motion.textarea
                      id="project-details"
                      value={projectDetails}
                      onChange={(event) => {
                        setProjectDetails(event.target.value);
                        event.target.style.height = "auto";
                        event.target.style.height = `${event.target.scrollHeight}px`;
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      rows={3}
                      placeholder="Describe your project..."
                      className="min-h-[110px] w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-cyan-400/70 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.14)]"
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FloatingField
                        id="client-name"
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                      <FloatingField
                        id="client-email"
                        label="Email"
                        type="email"
                        inputMode="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>

                    <FloatingField
                      id="client-phone"
                      label="Phone Number"
                      inputMode="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />

                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.97 }}
                      disabled={submitState === "loading"}
                      className="radiant-submit group relative mt-2 inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-zinc-100 backdrop-blur-xl sm:w-auto"
                    >
                      <span className="submit-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.46),transparent)]" />

                      <AnimatePresence mode="wait" initial={false}>
                        {submitState === "idle" && (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10"
                          >
                            Send Message
                          </motion.span>
                        )}
                        {submitState === "loading" && (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10 inline-flex items-center gap-2"
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </motion.span>
                        )}
                        {submitState === "sent" && (
                          <motion.span
                            key="sent"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10 inline-flex items-center gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Message Sent!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    {submitError ? (
                      <p className="text-sm text-red-300/90">{submitError}</p>
                    ) : null}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.84' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E");
          background-repeat: repeat;
          mix-blend-mode: soft-light;
          opacity: 0.32;
        }

        .contact-glass-card {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 28px 70px rgba(0, 0, 0, 0.45);
        }

        .sheen-layer {
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.04) 36%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0.04) 64%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-65%) rotate(8deg);
          animation: cardSheen 12s ease-in-out infinite;
        }

        .radiant-submit:hover .submit-sheen {
          animation: btnSheen 1.1s ease;
        }

        @keyframes cardSheen {
          0%,
          22% {
            transform: translateX(-72%) rotate(8deg);
            opacity: 0;
          }
          36% {
            opacity: 1;
          }
          56% {
            transform: translateX(118%) rotate(8deg);
            opacity: 0;
          }
          100% {
            transform: translateX(118%) rotate(8deg);
            opacity: 0;
          }
        }

        @keyframes btnSheen {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          22% {
            opacity: 1;
          }
          100% {
            transform: translateX(255%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
