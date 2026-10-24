import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

const easing = [0.22, 1, 0.36, 1] as const;

// Drop a transparent-background PNG at public/hisham.png.
const portraitSrc = `${import.meta.env.BASE_URL}hisham.png`;
type HeroSectionProps = {
  yearsOfExperience: number;
  appsShipped: number;
  onNavigate: (id: string) => void;
};

export function HeroSection({
  yearsOfExperience,
  appsShipped,
  onNavigate,
}: HeroSectionProps) {
  const [portraitMissing, setPortraitMissing] = useState(false);

  const stats = [
    {
      label: "Years of Experience",
      value: yearsOfExperience,
      decimals: 1,
    },
    { label: "Apps Shipped", value: appsShipped, decimals: 0 },
  ];

  return (
    <section
      id="home"
      className="relative scroll-mt-28 pt-2 md:pt-6 lg:min-h-[calc(100vh-7rem)]"
    >
      <div className="hero-dots pointer-events-none absolute inset-y-0 -left-[10vw] w-[80%]" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easing }}
          className="relative z-10 order-2 space-y-8 lg:order-1"
        >
          <div className="inline-flex items-center gap-2.5 text-sm font-medium text-[var(--color-text-secondary)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
            </span>
            Available for React.js & Flutter opportunities
          </div>

          <h1 className="font-display uppercase leading-[0.92] tracking-[-0.02em]">
            <span className="block text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
              It&rsquo;s me
            </span>
            <span className="hero-name mt-3 block text-[10.5vw] font-extrabold sm:text-6xl lg:text-[4rem] xl:text-[4.75rem]">
              Muhammed
              <br />
              Hisham
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-8 text-[var(--color-text-secondary)] md:text-xl">
            <span className="font-semibold text-[var(--color-text-primary)]">
              React.js & Flutter Developer
            </span>{" "}
            building clean, responsive interfaces for web and mobile.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-blue)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(47,111,237,0.35)] transition-transform hover:-translate-y-0.5"
            >
              View Work
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-6 py-3.5 text-sm font-medium text-[var(--color-text-primary)] backdrop-blur-xl"
            >
              Contact Me
            </button>
            <div className="flex items-center gap-4 pl-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              <a
                href="https://linkedin.com/in/hisham-ka"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-text-primary)]"
              >
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/Hishamkool"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-text-primary)]"
              >
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-6 pt-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix="+"
                    once={false}
                  />
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)] md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: easing, delay: 0.15 }}
          className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[17rem] sm:max-w-sm lg:order-2 lg:max-w-none"
        >
          <div className="hero-portrait-glow pointer-events-none absolute inset-0" />
          {portraitMissing ? (
            <div className="hero-portrait-fade absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[7rem] font-extrabold text-[var(--color-accent-blue)] opacity-20">
                HK
              </span>
            </div>
          ) : (
            <img
              src={portraitSrc}
              alt="Muhammed Hisham"
              onError={() => setPortraitMissing(true)}
              className="hero-portrait-fade relative h-full w-full object-contain object-center"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
