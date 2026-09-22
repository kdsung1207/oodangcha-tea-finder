import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUESTIONS } from "@/lib/tea-quiz";

export function QuizOverlay({
  step,
  answers,
  onAnswer,
  onBack,
  onClose,
}: {
  step: number;
  answers: number[];
  onAnswer: (answer: number) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  // Defensive: step should always be a valid QUESTIONS index, but a stray
  // out-of-range value (e.g. a race from a very fast double-tap) must never
  // crash this screen — that used to freeze the whole app on the error page.
  const question = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  if (!question) return null;
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-background safe-bottom">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={step === 0 ? onClose : onBack}
          aria-label="이전으로"
        >
          <ArrowLeft />
        </Button>
        <span className="text-xs font-bold tracking-normal text-muted-foreground">
          {step + 1} / {QUESTIONS.length}
        </span>
        <span className="w-9" />
      </header>
      <div className="mx-auto h-1.5 w-[calc(100%-2.5rem)] max-w-2xl overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full bg-brand-warm"
          animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>
      <main className="mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-2xl flex-col px-5 pb-10 pt-12 sm:pt-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-sm font-bold text-brand-warm">
              QUESTION {String(step + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-5xl">
              {question.title}
            </h2>
            <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2">
              {question.options.map((option, index) => (
                <Button
                  key={option.label}
                  variant="outline"
                  onClick={() => onAnswer(index)}
                  className="h-auto min-h-20 justify-between whitespace-normal rounded-2xl border-brand-deep/10 bg-card px-5 py-4 text-left text-base font-bold shadow-soft hover:border-brand-warm hover:bg-highlight sm:min-h-28"
                >
                  <span>{option.label}</span>
                  {answers[step] === index ? (
                    <Check className="text-brand-warm" />
                  ) : (
                    <span className="h-5 w-5 rounded-full border border-brand-deep/20" />
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
