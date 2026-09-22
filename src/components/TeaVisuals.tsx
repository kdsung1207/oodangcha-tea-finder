import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Tea } from "@/lib/tea-quiz";
import { TEA_INFO } from "@/lib/tea-quiz";

export function TeaCup({ compact = false }: { compact?: boolean }) {
  // Hides the browser's broken-image icon if public/hand-pinch.png hasn't
  // been uploaded yet, instead of showing a jarring placeholder icon.
  const [handMissing, setHandMissing] = useState(false);
  // A tall, slender tumbler rather than a squat teacup — grown taller, not
  // wider, so the 차고 badge (a fixed size in both variants) reads as small
  // against the cup's height specifically, not just smaller overall.
  return (
    <div
      className={`relative mx-auto ${compact ? "h-64 w-40" : "h-[30rem] w-56"}`}
      aria-label="손가락으로 차고를 집어 컵에 넣으려는 세로로 긴 찻잔 일러스트"
    >
      <span
        className={`steam absolute rounded-full bg-brand-warm/30 ${
          compact ? "left-[24%] top-16 h-10 w-1" : "left-[26%] top-44 h-16 w-1"
        }`}
      />
      <span
        className={`steam steam-delay absolute rounded-full bg-brand-warm/25 ${
          compact ? "left-[74%] top-12 h-12 w-1" : "left-[73%] top-40 h-20 w-1"
        }`}
      />
      {/* Cup body sits above the saucer in stacking order (z-10 over z-0) so
          its base reads as resting on top of the saucer, not tucked under
          the saucer's edge. */}
      <div
        className={`absolute z-10 rounded-t-2xl border-2 border-brand-deep/15 bg-card shadow-soft ${
          compact
            ? "bottom-2 left-3 right-6 h-40 rounded-b-[0.9rem]"
            : "bottom-4 left-4 right-7 h-64 rounded-b-[1.25rem]"
        }`}
      >
        <div
          className={`absolute rounded-[50%] bg-brand-warm/65 ${
            compact ? "left-2 right-2 top-1.5 h-3" : "left-3 right-3 top-2 h-5"
          }`}
        />
      </div>
      {/* Saucer the cup rests on, in place of the handle. */}
      <div
        className={`absolute left-1/2 z-0 -translate-x-1/2 rounded-[50%] border border-brand-deep/15 bg-card shadow-soft ${
          compact ? "bottom-1 h-2.5 w-44" : "bottom-1 h-4 w-64"
        }`}
      />
      <div
        className={`absolute left-1/2 z-0 -translate-x-1/2 rounded-[50%] bg-brand-deep/5 ${
          compact ? "bottom-2 h-1 w-32" : "bottom-2.5 h-1.5 w-48"
        }`}
      />
      {/* Fingers pinching the 차고 capsule above the rim — about to drop it
          in, not inside the cup yet. The hand is the supplied illustration,
          used as-is (unedited) and sized well above the capsule. */}
      {!compact && !handMissing && (
        <img
          src="/hand-pinch.png"
          alt=""
          aria-hidden="true"
          onError={() => setHandMissing(true)}
          className={`absolute z-20 -translate-x-1/2 -rotate-[30deg] object-contain ${
            compact
              ? "left-[58%] -top-24 h-[16.5rem] w-96"
              : "left-[58%] -top-[10.5rem] h-[27rem] w-[39rem]"
          }`}
        />
      )}
      <div
        className={`absolute z-20 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-md border border-brand-deep/10 bg-highlight font-bold leading-none text-highlight-foreground shadow-soft ${
          compact ? "top-16 h-[14px] w-7 text-[4.5px]" : "top-32 h-[18px] w-9 text-[5.5px]"
        }`}
      >
        백다담
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
          className="absolute left-1/2 top-0 z-20 flex h-[21px] w-9 items-center justify-center rounded-md border border-brand-deep/15 bg-highlight text-[5.5px] font-bold text-highlight-foreground shadow-lift"
          style={{ marginLeft: -18 }}
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
          백다담
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
              className="font-brand-serif text-5xl font-black text-white"
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
