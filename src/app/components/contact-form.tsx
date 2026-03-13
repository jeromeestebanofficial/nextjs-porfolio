"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type ServiceOption =
  | "Web & App Development"
  | "IT Infrastructure & Technical Support"
  | "Training & Mentorship"
  | "Other";
type SubmitState = "idle" | "loading" | "sent";

const OPTIONS: ServiceOption[] = [
  "Web & App Development",
  "IT Infrastructure & Technical Support",
  "Training & Mentorship",
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canContinueFromStep1 = useMemo(() => selectedService !== null, [selectedService]);
  const canContinueFromStep2 = useMemo(
    () => Boolean(selectedDate && selectedTime.trim()),
    [selectedDate, selectedTime],
  );

  useEffect(() => {
    if (step !== 3) {
      return;
    }
    const timeout = window.setTimeout(() => {
      const clientName = document.getElementById("client-name");
      clientName?.focus();
    }, 220);
    return () => window.clearTimeout(timeout);
  }, [step]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState !== "idle") {
      return;
    }
    if (!selectedService || !selectedDate || !selectedTime.trim() || !name.trim() || !email.trim()) {
      setSubmitError("Please complete category, date, time, name, and email.");
      return;
    }

    setSubmitState("loading");
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedService,
          date: selectedDate.toISOString(),
          time: selectedTime,
          name,
          email,
          phone,
          extraInfo,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Failed to send message.");
      }

      setSubmitState("sent");
      setName("");
      setEmail("");
      setPhone("");
      setSelectedService(null);
      setSelectedDate(undefined);
      setSelectedTime("");
      setExtraInfo("");
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
            <h2 className="text-[1.9rem] font-black tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
              Contact Me
            </h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              A quick service request flow where you choose a category, pick a date, then share your details.
            </p>

            <div className="mt-7">
              <AnimatePresence mode="wait">
                {submitState === "sent" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-2xl sm:p-8"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                    >
                      <Check className="h-7 w-7" />
                    </motion.div>
                    <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-zinc-300">
                      THANK YOU
                    </p>
                    <p className="mt-2 text-sm text-zinc-200 sm:text-base">
                      Your request has been logged. I will be in touch shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitState("idle")}
                      className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/15"
                    >
                      Send another request
                    </button>
                  </motion.div>
                ) : step === 1 ? (
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
                      className="flex flex-wrap gap-2"
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
                            className={`rounded-full border px-4 py-2 text-sm leading-snug transition-all duration-200 ${
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
                        onClick={() => canContinueFromStep1 && setStep(2)}
                        disabled={!canContinueFromStep1}
                        className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 disabled:cursor-not-allowed disabled:opacity-45 md:w-auto"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div
                    key="step-2"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-zinc-300">
                        Category: <span className="text-zinc-100">{selectedService}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
                      >
                        Change
                      </button>
                    </div>

                    <p className="text-sm font-medium text-zinc-200">Select a date and time</p>

                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:items-start">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-2xl sm:p-4">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          fromDate={new Date()}
                          showOutsideDays
                          className="w-full text-zinc-100"
                          classNames={{
                            caption: "flex items-center justify-between px-2 py-2",
                            caption_label: "text-sm font-semibold text-zinc-100",
                            nav: "flex items-center gap-1",
                            nav_button:
                              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-100 transition-colors hover:bg-white/10",
                            table: "w-full border-collapse",
                            head_row: "",
                            head_cell:
                              "py-2 text-center text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-400",
                            row: "",
                            cell: "p-1 text-center",
                            day:
                              "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-zinc-200 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
                            day_today: "border border-white/15 bg-white/5 text-zinc-100",
                            day_selected:
                              "bg-cyan-400/15 text-white shadow-[0_0_0_2px_rgba(6,182,212,0.22),0_0_24px_rgba(6,182,212,0.22)]",
                            day_outside: "text-zinc-600 opacity-60",
                            day_disabled: "text-zinc-700 opacity-50",
                          }}
                        />
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200 backdrop-blur-2xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                          Time preference
                        </p>
                        <p className="text-xs text-zinc-400">
                          A rough time window is enough; it simply helps me plan replies and calls.
                        </p>
                        <div className="mt-1">
                          <label className="group relative block">
                            <input
                              type="time"
                              value={selectedTime}
                              onChange={(event) => setSelectedTime(event.target.value)}
                              className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200 focus:border-cyan-400/70 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.18)]"
                            />
                          </label>
                          <p className="mt-1 text-[11px] text-zinc-500">
                            Example: 14:30 in your local time.
                          </p>
                        </div>

                        <div className="mt-2 text-xs text-zinc-400">
                          {selectedDate ? (
                            <>
                              <span className="text-zinc-500">Selected:</span>{" "}
                              <span className="text-zinc-200">
                                {selectedDate.toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              {selectedTime ? (
                                <>
                                  {" "}
                                  at <span className="text-zinc-200">{selectedTime}</span>
                                </>
                              ) : null}
                            </>
                          ) : (
                            <span>Pick a date, then choose a time.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep(1)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10 sm:w-auto"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => canContinueFromStep2 && setStep(3)}
                        disabled={!canContinueFromStep2}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors disabled:cursor-not-allowed disabled:opacity-45 hover:bg-white/15 sm:w-auto"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="step-3"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-zinc-300">
                        Category: <span className="text-zinc-100">{selectedService}</span>
                      </p>
                      <p className="text-xs text-zinc-400">
                        Date:{" "}
                        <span className="text-zinc-200">
                          {selectedDate
                            ? selectedDate.toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Not selected"}
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

                    <motion.textarea
                      id="extra-info"
                      value={extraInfo}
                      onChange={(event) => setExtraInfo(event.target.value)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      rows={3}
                      placeholder="Other details you’d like to share (optional)…"
                      className="min-h-[96px] w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-cyan-400/70 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.14)]"
                    />

                    {submitError ? (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                      >
                        {submitError}
                      </motion.p>
                    ) : null}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep(2)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10 sm:w-auto"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </motion.button>

                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={submitState === "loading"}
                        className="radiant-submit group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-zinc-100 backdrop-blur-xl md:w-auto"
                      >
                        <span className="submit-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.46),transparent)]" />
                        <span className="relative z-10 inline-flex items-center gap-2">
                          {submitState === "loading" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Transmitting...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Submit request
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>
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
