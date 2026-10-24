import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { Moon, SunMedium } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { LucideIcon } from "lucide-react";

export type DockNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type LiquidDockProps = {
  navItems: DockNavItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: (origin: { x: number; y: number }) => void;
  showHoverLabels?: boolean;
};

// Magnification tuning: how many "icon slots" the cursor's influence spans,
// how much an icon scales up at the cursor's exact center, and how far it lifts.
const MAGNIFY_RADIUS = 1.35;
const MAGNIFY_SCALE = 0.48;
const NO_HOVER = -10;
// How long a tapped dock item's label stays visible on touch screens.
const TAP_LABEL_MS = 1200;

function useMagnify(
  mouseFraction: MotionValue<number>,
  centerFraction: number,
  slotCount: number,
) {
  const rawScale = useTransform(mouseFraction, (value) => {
    const distance = Math.abs(value - centerFraction) * slotCount;
    if (distance > MAGNIFY_RADIUS) return 1;
    const falloff = Math.exp(-((distance / (MAGNIFY_RADIUS * 0.55)) ** 2));
    return 1 + MAGNIFY_SCALE * falloff;
  });
  return {
    scale: useSpring(rawScale, { stiffness: 320, damping: 20, mass: 0.4 }),
    y: useSpring(0, { stiffness: 260, damping: 26, mass: 0.5 }),
  };
}

// Scroll-driven sheen and rim glare shared by every liquid-glass surface.
function useLiquidGlass() {
  const { scrollY } = useScroll();
  const sheenPosition = useTransform(
    scrollY,
    (value) => `${((value * 0.12) % 260) - 60}% 50%`,
  );

  // Rotates the edge reflection around the border as the page scrolls.
  const smoothScrollY = useSpring(scrollY, { stiffness: 120, damping: 30 });
  const glareAngle = useTransform(
    smoothScrollY,
    (value) => `${(135 + value * 0.18) % 360}deg`,
  );

  return { sheenPosition, glareAngle };
}

const DockIcon = forwardRef<
  HTMLButtonElement,
  {
    icon: LucideIcon;
    label: string;
    centerFraction: number;
    slotCount: number;
    mouseFraction: MotionValue<number>;
    isActive?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    showHoverLabels?: boolean;
    className?: string;
    // Right-align the label on mobile so the last item's label stays on screen.
    alignLabelEnd?: boolean;
    showTapLabel?: boolean;
  }
>(function DockIcon(
  {
    icon: Icon,
    label,
    centerFraction,
    slotCount,
    mouseFraction,
    isActive,
    onClick,
    showHoverLabels = true,
    className = "flex",
    alignLabelEnd = false,
    showTapLabel = false,
  },
  ref,
) {
  const { scale, y } = useMagnify(mouseFraction, centerFraction, slotCount);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group relative z-10 ${className} h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-primary)] min-[380px]:h-12 min-[380px]:w-12 md:h-14 md:w-14 lg:h-20 lg:w-20`}
    >
      {showHoverLabels && (
        <span
          className={`pointer-events-none absolute -top-10 whitespace-nowrap ${
            alignLabelEnd
              ? "right-0 md:right-auto md:left-1/2 md:-translate-x-1/2"
              : "left-1/2 -translate-x-1/2"
          } rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-[var(--color-text-primary)] uppercase shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 md:-top-11 md:text-[11px] ${
            showTapLabel ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      )}
      {isActive && (
        <motion.span
          layoutId="dock-indicator"
          className="dock-active-pill absolute inset-0 rounded-full"
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
      )}
      <motion.span
        style={{ scale, y }}
        className="relative z-10 flex items-center justify-center"
      >
        <Icon className="dock-icon h-[22px] w-[22px] md:h-5 md:w-5 lg:h-7 lg:w-7" />
      </motion.span>
    </motion.button>
  );
});

export function LiquidDock({
  navItems,
  activeSection,
  onNavigate,
  theme,
  onToggleTheme,
  showHoverLabels = true,
}: LiquidDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mouseFraction = useMotionValue(NO_HOVER);
  const dropX = useMotionValue(0.5);
  const dropTrail = useSpring(dropX, {
    stiffness: 130,
    damping: 15,
    mass: 0.7,
  });
  const [hovering, setHovering] = useState(false);

  // Touch screens have no hover, so tapping an item briefly shows its label;
  // only the most recently tapped one is shown.
  const [tapLabelId, setTapLabelId] = useState<string | null>(null);
  const pointerTypeRef = useRef("mouse");
  const tapLabelTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(tapLabelTimer.current), []);

  const flashTapLabel = (id: string) => {
    if (pointerTypeRef.current === "mouse") return;
    setTapLabelId(id);
    window.clearTimeout(tapLabelTimer.current);
    tapLabelTimer.current = window.setTimeout(
      () => setTapLabelId(null),
      TAP_LABEL_MS,
    );
  };
  const [hoverTargetIndex, setHoverTargetIndex] = useState<number | null>(null);
  const MIN_DROP_SIZE = 16;
  const MAX_DROP_SIZE = 80;
  const dropSize = useSpring(MIN_DROP_SIZE, {
    /*     stiffness: 300,
    damping: 20,
    mass: 1, */

    stiffness: 170,
    damping: 26,
    mass: 1,

    /*

    high stiffness + low damping = quick jumpy motion
    low stiffness + high damping = smooth, liquid motion

    Stiffness:
      how strongly the spring pulls toward the target
      higher value = faster, more forceful snap
      lower value = softer, slower movement

    Damping:
      how much the motion is resisted
      higher value = calmer, less wobble, more controlled
      lower value = more bounce / overshoot

    Mass:
      how “heavy” the object feels
      higher mass = slower, heavier motion
      lower mass = quick, lighter motion
*/
  });

  const slotCount = navItems.length + 1;

  // Icon centers are measured from the real DOM layout rather than assumed
  // to be evenly spread across the container, since padding/gaps mean the
  // two don't match — that mismatch made the magnify effect peak off-center.
  const [centers, setCenters] = useState<number[]>(
    Array.from({ length: slotCount }, (_, index) => (index + 0.5) / slotCount),
  );

  useLayoutEffect(() => {
    const measure = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect || containerRect.width === 0) return;
      const next = itemRefs.current.map((el, index) => {
        if (!el) return (index + 0.5) / slotCount;
        const rect = el.getBoundingClientRect();
        return (
          (rect.left + rect.width / 2 - containerRect.left) /
          containerRect.width
        );
      });
      setCenters(next);
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [slotCount]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const fraction = (event.clientX - rect.left) / rect.width;
    const nearestIndex = centers.reduce<number | null>(
      (closest, center, index) => {
        if (closest === null) return index;
        const currentDistance = Math.abs(center - fraction);
        const closestDistance = Math.abs(centers[closest] - fraction);
        return currentDistance < closestDistance ? index : closest;
      },
      null,
    );

    mouseFraction.set(fraction);
    dropX.set(fraction);
    setHoverTargetIndex(nearestIndex);
    setHovering(true);
  };

  const handleLeave = () => {
    mouseFraction.set(NO_HOVER);
    setHoverTargetIndex(null);
    setHovering(false);
  };

  const targetIndex = hoverTargetIndex ?? 0;
  const activeTargetCenter = centers[targetIndex] ?? 0.5;
  const activeTargetWidth =
    itemRefs.current[targetIndex] && itemRefs.current[targetIndex]!.offsetWidth
      ? itemRefs.current[targetIndex]!.offsetWidth
      : 56;

  const blobX = useTransform(dropX, (value) => {
    const targetPercent = (activeTargetCenter ?? 0.5) * 100;
    const pointerPercent = value * 100;
    const blend = targetPercent * 0.7 + pointerPercent * 0.3;
    return `${blend}%`;
  });

  const targetDropSize = Math.min(
    MAX_DROP_SIZE,
    Math.max(MIN_DROP_SIZE, activeTargetWidth * 1),
  );

  useEffect(() => {
    const nextSize = hoverTargetIndex === null ? MIN_DROP_SIZE : targetDropSize;
    dropSize.set(nextSize);
  }, [dropSize, hoverTargetIndex, targetDropSize]);

  const blobWidth = useTransform(dropSize, (size) => `${size}px`);
  const blobHeight = useTransform(dropSize, (size) => `${size}px`);

  const { sheenPosition, glareAngle } = useLiquidGlass();

  const dropTrailLeft = useTransform(dropTrail, (v) => `${v * 100}%`);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
      }}
      style={{ "--glare-angle": glareAngle } as MotionStyle}
      className="liquid-glass pointer-events-auto relative flex w-full max-w-full items-center justify-between rounded-[32px] p-2 md:w-auto md:justify-start md:gap-2 lg:gap-3 lg:rounded-[36px] lg:p-3"
    >
      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="dock-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <motion.div
          aria-hidden="true"
          style={{ backgroundPosition: sheenPosition }}
          className="liquid-sheen absolute inset-[-40%] z-[1]"
        />

        {hovering && (
          <div
            aria-hidden="true"
            style={{ filter: "url(#dock-goo)" }}
            className="absolute inset-0 z-0"
          >
            <motion.span
              className="drop-blob"
              style={{
                left: blobX,
                width: blobWidth,
                height: blobHeight,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <motion.span
              className="drop-blob drop-blob--trail"
              style={{
                left: dropTrailLeft,
                width: blobWidth,
                height: blobHeight,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        )}
      </div>

      {navItems.map((item, index) => (
        <DockIcon
          key={item.id}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          icon={item.icon}
          label={item.label}
          centerFraction={centers[index] ?? (index + 0.5) / slotCount}
          slotCount={slotCount}
          mouseFraction={mouseFraction}
          isActive={item.id === activeSection}
          alignLabelEnd={index === navItems.length - 1}
          showTapLabel={tapLabelId === item.id}
          onClick={() => {
            flashTapLabel(item.id);
            onNavigate(item.id);
          }}
          showHoverLabels={showHoverLabels}
        />
      ))}

      <DockIcon
        ref={(el) => {
          itemRefs.current[navItems.length] = el;
        }}
        icon={theme === "light" ? Moon : SunMedium}
        label="Toggle color mode"
        centerFraction={
          centers[navItems.length] ?? (navItems.length + 0.5) / slotCount
        }
        slotCount={slotCount}
        mouseFraction={mouseFraction}
        className="hidden md:flex"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          onToggleTheme({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }}
        showHoverLabels={showHoverLabels}
      />
    </motion.div>
  );
}

// Round liquid-glass theme toggle that floats at the top right on mobile,
// where the dock has no room for it.
export function LiquidThemeToggle({
  theme,
  onToggleTheme,
}: Pick<LiquidDockProps, "theme" | "onToggleTheme">) {
  const { sheenPosition, glareAngle } = useLiquidGlass();
  const Icon = theme === "light" ? Moon : SunMedium;

  return (
    <motion.button
      type="button"
      aria-label="Toggle color mode"
      whileTap={{ scale: 0.92 }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onToggleTheme({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }}
      style={{ "--glare-angle": glareAngle } as MotionStyle}
      className="liquid-glass pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-text-primary)]"
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <motion.span
          aria-hidden="true"
          style={{ backgroundPosition: sheenPosition }}
          className="liquid-sheen absolute inset-[-40%] z-[1]"
        />
      </span>
      <Icon className="dock-icon relative z-10 h-5 w-5" />
    </motion.button>
  );
}
