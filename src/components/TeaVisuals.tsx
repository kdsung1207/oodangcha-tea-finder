import { motion, useReducedMotion } from "framer-motion";
import { Coffee } from "lucide-react";
import type { Tea } from "@/lib/tea-quiz";
import { TEA_INFO } from "@/lib/tea-quiz";

export function TeaCup({ compact = false }: { compact?: boolean }) {
  return <div className={`relative mx-auto ${compact ? "h-40 w-48" : "h-64 w-72"}`} aria-label="김이 피어오르는 따뜻한 찻잔 일러스트">
    <span className="steam absolute left-[42%] top-3 h-16 w-1 rounded-full bg-brand-warm/30" />
    <span className="steam steam-delay absolute left-[55%] top-0 h-20 w-1 rounded-full bg-brand-warm/25" />
    <div className="absolute bottom-8 left-6 right-10 h-28 rounded-b-[4rem] rounded-t-2xl border-2 border-brand-deep/15 bg-card shadow-soft">
      <div className="absolute left-3 right-3 top-2 h-5 rounded-[50%] bg-brand-warm/65" />
    </div>
    <div className="absolute bottom-16 right-0 h-16 w-16 rounded-r-full border-[10px] border-l-0 border-brand-deep/15" />
    <div className="absolute bottom-3 left-2 right-4 h-5 rounded-[50%] bg-brand-deep/10" />
    <div className="absolute bottom-20 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-brand-deep/10 bg-highlight text-xs font-bold text-highlight-foreground shadow-soft">차고</div>
  </div>;
}

export function BrewAnimation({ tea, onDone }: { tea: Tea; onDone: () => void }) {
  const reduced = useReducedMotion();
  const duration = reduced ? .4 : 3.2;
  return <motion.div className="fixed inset-0 z-50 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <button type="button" onClick={onDone} className="absolute right-5 top-5 z-20 text-sm font-semibold text-muted-foreground underline decoration-brand-warm underline-offset-4">건너뛰고 결과 보기</button>
    <div className="relative h-80 w-full max-w-sm">
      <motion.div className="absolute left-1/2 top-0 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-brand-deep/15 bg-highlight text-[11px] font-bold text-highlight-foreground shadow-lift" initial={{ y: -30, rotate: -18 }} animate={{ y: 188, rotate: 160 }} transition={{ duration: reduced ? .2 : .8, delay: .25, ease: "easeIn" }}>차고</motion.div>
      <div className="absolute bottom-4 left-1/2 h-52 w-64 -translate-x-1/2 overflow-hidden rounded-b-[4.5rem] border-2 border-brand-deep/20 bg-card/40 shadow-lift">
        <div className="absolute inset-x-2 top-5 h-8 rounded-[50%] border border-brand-deep/10 bg-card/70" />
        <motion.div className="absolute bottom-0 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full blur-xl" style={{ background: TEA_INFO[tea].color }} initial={{ scale: .05, opacity: 0 }} animate={{ scale: 5, opacity: .82 }} transition={{ duration: reduced ? .2 : 2.1, delay: reduced ? .1 : 1, ease: "easeOut" }} />
        <motion.div className="absolute inset-x-0 bottom-0 h-[88%]" style={{ background: TEA_INFO[tea].soft }} initial={{ opacity: 0 }} animate={{ opacity: .72 }} transition={{ duration: reduced ? .2 : 1.5, delay: reduced ? .1 : 1.5 }} />
      </div>
    </div>
    <motion.p className="mt-4 font-display text-xl font-bold" initial={{ opacity: .4 }} animate={{ opacity: 1 }} transition={{ repeat: reduced ? 0 : Infinity, repeatType: "reverse", duration: .8 }}>당신에게 맞는 차를 우려내는 중...</motion.p>
    <motion.span className="mt-3 text-sm text-muted-foreground" animate={{ opacity: [0, 1, 0] }} transition={{ duration, ease: "easeInOut" }} onAnimationComplete={onDone}>오늘의 차가 천천히 빛을 내고 있어요</motion.span>
  </motion.div>;
}
