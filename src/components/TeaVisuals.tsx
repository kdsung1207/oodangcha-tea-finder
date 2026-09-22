import { motion, useReducedMotion } from "framer-motion";
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

  // Timeline (non-reduced-motion): drop falls → lands & fully dissolves →
  // color spreads through the water and the tea name reveals in lockstep,
  // all inside this one brewing screen → a short hold, then onDone.
  const dropDelay = reduced ? 0.1 : 0.3;
  const dropDuration = reduced ? 0.15 : 0.75;
  const impact = dropDelay + dropDuration;
  const dissolveDuration = reduced ? 0.15 : 0.5;
  const dissolveEnd = impact + dissolveDuration;
  const bloomDuration = reduced ? 0.15 : 1;
  const colorSettled = dissolveEnd + bloomDuration;
  const holdDuration = reduced ? 0.3 : 1.3;
  const duration = reduced ? 0.6 : colorSettled + holdDuration;

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
      <div className="relative h-[30rem] w-full max-w-md">
        {/* capsule falls in, then fully melts away — nothing round is left behind */}
        <motion.div
          className="absolute left-1/2 top-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-brand-deep/15 bg-highlight text-xs font-bold text-highlight-foreground shadow-lift"
          style={{ marginLeft: -28 }}
          initial={{ y: -30, rotate: -18, scale: 1, opacity: 1 }}
          animate={{
            y: [-30, 150, 150],
            rotate: [-18, 140, 140],
            scale: [1, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: dropDuration + dissolveDuration,
            delay: dropDelay,
            times: [0, dropDuration / (dropDuration + dissolveDuration), 1],
            ease: ["easeIn", "easeIn", "easeIn"],
          }}
        >
          차고
        </motion.div>

        <div className="absolute bottom-6 left-1/2 h-80 w-96 -translate-x-1/2 overflow-hidden rounded-b-[5.5rem] border-2 border-brand-deep/20 bg-card/40 shadow-lift">
          {/* liquid surface line */}
          <div className="absolute inset-x-3 top-6 h-9 rounded-[50%] border border-brand-deep/10 bg-card/70" />

          {/* still, pale water before the tea takes hold */}
          <div
            className="absolute inset-x-0 bottom-0 top-6"
            style={{ background: info.soft, opacity: 0.16 }}
          />

          {/* impact ripples right where the capsule lands */}
          {[0, 1].map((r) => (
            <motion.span
              key={r}
              className="absolute left-1/2 top-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{ borderColor: info.color }}
              initial={{ width: 4, height: 4, opacity: 0.5 }}
              animate={{ width: 90 + r * 44, height: 90 + r * 44, opacity: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.85,
                delay: dissolveEnd - 0.15 + r * 0.12,
                ease: "easeOut",
              }}
            />
          ))}

          {/* the capsule dissolves into one color wash that grows large enough
              to cover every corner of the cup — plain blur only (no contrast
              trick), so it never clips to black and never stalls as a
              leftover round patch */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: 24,
              marginLeft: -260,
              width: 520,
              height: 520,
              background: info.color,
              filter: "blur(14px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.96 }}
            transition={{ duration: bloomDuration, delay: dissolveEnd, ease: "easeInOut" }}
          />

          {/* tea name: invisible against the plain water, revealed in lockstep
              with the very same color spread above (not a separate timed
              fade), so it only becomes legible as the tea actually fills in */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: bloomDuration, delay: dissolveEnd, ease: "easeInOut" }}
          >
            <span
              className="font-display text-5xl font-black text-white"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
            >
              {tea}
            </span>
          </motion.div>

          {/* glass caustic highlight for a wet, realistic sheen */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.35) 46%, transparent 60%)",
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
