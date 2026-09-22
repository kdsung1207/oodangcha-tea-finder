import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Coffee } from "lucide-react";
import type { Tea } from "@/lib/tea-quiz";
import { TEA_INFO } from "@/lib/tea-quiz";

export function TeaCup({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative mx-auto ${compact ? "h-40 w-48" : "h-64 w-72"}`}
      aria-label="김이 피어오르는 따뜻한 찻잔 일러스트"
    >
      <span className="steam absolute left-[42%] top-3 h-16 w-1 rounded-full bg-brand-warm/30" />
      <span className="steam steam-delay absolute left-[55%] top-0 h-20 w-1 rounded-full bg-brand-warm/25" />
      <div className="absolute bottom-8 left-6 right-10 h-28 rounded-b-[4rem] rounded-t-2xl border-2 border-brand-deep/15 bg-card shadow-soft">
        <div className="absolute left-3 right-3 top-2 h-5 rounded-[50%] bg-brand-warm/65" />
      </div>
      <div className="absolute bottom-16 right-0 h-16 w-16 rounded-r-full border-[10px] border-l-0 border-brand-deep/15" />
      <div className="absolute bottom-3 left-2 right-4 h-5 rounded-[50%] bg-brand-deep/10" />
      <div className="absolute bottom-20 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-brand-deep/10 bg-highlight text-xs font-bold text-highlight-foreground shadow-soft">
        차고
      </div>
    </div>
  );
}

export function BrewAnimation({ tea, onDone }: { tea: Tea; onDone: () => void }) {
  const reduced = useReducedMotion();
  const info = TEA_INFO[tea];

  const dropDelay = reduced ? 0.1 : 0.25;
  const dropDuration = reduced ? 0.15 : 0.8;
  const impact = dropDelay + dropDuration;
  const duration = reduced ? 0.4 : impact + 2.6;

  // Irregular ink-cloud blobs: randomized once per result so the diffusion
  // reads as organic fluid motion rather than a single scaling circle.
  const blobs = useMemo(() => {
    const count = 8;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.7;
      const dist = 30 + Math.random() * 48;
      const size = 30 + Math.random() * 46;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.max(-6, Math.sin(angle) * dist * 0.65) + 26,
        size,
        delay: impact + Math.random() * 0.3,
        dur: reduced ? 0.2 : 1.6 + Math.random() * 1,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tea]);

  const specks = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 150,
      y: 30 + Math.random() * 90,
      delay: impact + 0.5 + Math.random() * 1.4,
      dur: 1.3 + Math.random() * 1.5,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tea]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        type="button"
        onClick={onDone}
        className="absolute right-5 top-5 z-20 text-sm font-semibold text-muted-foreground underline decoration-brand-warm underline-offset-4"
      >
        건너뛰고 결과 보기
      </button>
      <div className="relative h-80 w-full max-w-sm">
        <motion.div
          className="absolute left-1/2 top-0 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-brand-deep/15 bg-highlight text-[11px] font-bold text-highlight-foreground shadow-lift"
          initial={{ y: -30, rotate: -18 }}
          animate={{ y: 188, rotate: 160 }}
          transition={{ duration: dropDuration, delay: dropDelay, ease: "easeIn" }}
        >
          차고
        </motion.div>
        <div className="absolute bottom-4 left-1/2 h-52 w-64 -translate-x-1/2 overflow-hidden rounded-b-[4.5rem] border-2 border-brand-deep/20 bg-card/40 shadow-lift">
          {/* liquid surface line */}
          <div className="absolute inset-x-2 top-5 h-8 rounded-[50%] border border-brand-deep/10 bg-card/70" />

          {/* impact ripples on contact */}
          {[0, 1, 2].map((r) => (
            <motion.span
              key={r}
              className="absolute left-1/2 top-9 rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
              style={{ borderColor: info.color }}
              initial={{ width: 4, height: 4, opacity: 0.55 }}
              animate={{ width: 70 + r * 34, height: 70 + r * 34, opacity: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.9,
                delay: impact + r * 0.1,
                ease: "easeOut",
              }}
            />
          ))}

          {/* gooey ink diffusion: several soft blobs merged via blur+contrast
              so the spreading edge looks like real liquid, not a vector circle */}
          <div
            className="absolute inset-x-0 bottom-0 top-9 overflow-hidden"
            style={{ filter: "blur(13px) contrast(24) saturate(1.35)" }}
          >
            <motion.span
              className="absolute top-0 rounded-full"
              style={{
                left: "50%",
                marginLeft: -15,
                width: 30,
                height: 30,
                background: info.color,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2.4, 3.6], opacity: [0, 0.95, 0.88] }}
              transition={{ duration: reduced ? 0.2 : 1.2, delay: impact, ease: "easeOut" }}
            />
            {blobs.map((b) => (
              <motion.span
                key={b.id}
                className="absolute top-0 rounded-full"
                style={{
                  left: "50%",
                  marginLeft: -b.size / 2,
                  width: b.size,
                  height: b.size,
                  background: info.color,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: [0, b.x * 0.55, b.x],
                  y: [0, b.y * 1.25, b.y + 34],
                  scale: [0.15, 1.25, 1],
                  opacity: [0, 0.92, 0.75],
                }}
                transition={{ duration: b.dur, delay: b.delay, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* concentration wash: darker near the surface, settling evenly once diffused */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[88%]"
            style={{
              background: `linear-gradient(to bottom, ${info.color} 0%, ${info.soft} 55%, ${info.soft} 100%)`,
              mixBlendMode: "multiply",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.28, 0.62] }}
            transition={{
              duration: reduced ? 0.2 : 1.4,
              delay: reduced ? 0.1 : impact + 0.9,
              ease: "easeOut",
            }}
          />

          {/* suspended tea particles for texture/depth */}
          {specks.map((s) => (
            <motion.span
              key={s.id}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-brand-deep/40"
              initial={{ x: s.x, y: s.y, opacity: 0 }}
              animate={{ y: s.y - 18, opacity: [0, 0.55, 0] }}
              transition={{
                duration: s.dur,
                delay: s.delay,
                repeat: reduced ? 0 : Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}

          {/* glass caustic highlight for a wet, realistic sheen */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.4) 46%, transparent 60%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
      <motion.p
        className="mt-4 font-display text-xl font-bold"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: reduced ? 0 : Infinity, repeatType: "reverse", duration: 0.8 }}
      >
        당신에게 맞는 차를 우려내는 중...
      </motion.p>
      <motion.span
        className="mt-3 text-sm text-muted-foreground"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      >
        오늘의 차가 천천히 빛을 내고 있어요
      </motion.span>
    </motion.div>
  );
}
