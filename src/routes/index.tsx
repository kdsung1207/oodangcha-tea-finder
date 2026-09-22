import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Coffee,
  Copy,
  Download,
  Droplets,
  ExternalLink,
  Heart,
  Leaf,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrewAnimation, TeaCup } from "@/components/TeaVisuals";
import { QuizOverlay } from "@/components/QuizOverlay";
import {
  buildReason,
  calculateTeaResult,
  COUPON_CODE,
  QUESTIONS,
  SHOP_URL,
  SLOT_CAPACITY,
  TEA_INFO,
  TIMESLOTS,
  type Tea,
} from "@/lib/tea-quiz";
import { getSlotCounts, submitSignup } from "@/lib/signups.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "오당차 | 오늘, 당신의 차 한잔" },
      {
        name: "description",
        content: "6개의 질문으로 오늘의 나에게 어울리는 백다담 차고를 찾아보세요.",
      },
      { property: "og:title", content: "오당차 | 오늘, 당신의 차 한잔" },
      { property: "og:description", content: "오늘의 취향에 어울리는 백다담 차고를 만나보세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Flow = "landing" | "quiz" | "brewing" | "result";
type Counts = { time: string; count: number; capacity: number }[];

function Index() {
  const [flow, setFlow] = useState<Flow>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [tea, setTea] = useState<Tea>("루이보스차");
  const resultRef = useRef<HTMLDivElement>(null);

  const answer = (index: number) => {
    const next = [...answers.slice(0, step), index];
    setAnswers(next);
    window.setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep((value) => value + 1);
      else {
        setTea(calculateTeaResult(next));
        setFlow("brewing");
      }
    }, 180);
  };
  const restart = () => {
    setAnswers([]);
    setStep(0);
    setFlow("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <main className="paper-grain min-h-screen overflow-x-hidden">
      <section className="relative flex min-h-[92dvh] flex-col px-5 pb-8 pt-5 sm:px-10 lg:px-16">
        <header className="mx-auto flex w-full max-w-6xl items-start justify-between">
          <div>
            <p className="font-display text-xl font-black">백다담</p>
            <p className="mt-1 text-xs text-muted-foreground">오늘, 당신의 차 한잔</p>
          </div>
          <span className="rounded-full border border-brand-deep/10 bg-card/70 px-3 py-1.5 text-xs font-semibold">
            BAEKDADAM TEA LAB
          </span>
        </header>
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-2 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:pt-4">
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-highlight px-4 py-2 text-sm font-bold text-highlight-foreground">
              백다담
            </span>
            <h1 className="mt-7 font-display text-5xl font-black leading-[1.07] sm:text-7xl lg:text-8xl">
              오늘, 당신의
              <br />차 한잔
              <br />
              <span className="text-brand-warm">오당차</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              오늘 당신에게 어울리는 차고를 찾아보세요.
              <br className="hidden sm:block" /> 몇 가지 질문에 답하면 오늘의 백다담을 추천해드려요.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                onClick={() => setFlow("quiz")}
                className="h-14 rounded-xl px-6 text-base shadow-lift"
              >
                오당차 시작하기 <ArrowRight />
              </Button>
              <span className="text-sm font-semibold text-muted-foreground">
                약 1분 · 6개의 질문
              </span>
            </div>
          </div>
          <div className="relative mt-4 flex flex-col items-center self-end lg:mt-0">
            <TeaCup />
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground">
              제품 이미지 자리 · 브랜드 제공 시 교체
            </span>
          </div>
        </div>
        <ChevronDown className="mx-auto mt-3 animate-bounce text-brand-warm" aria-hidden="true" />
      </section>
      <AnimatePresence>
        {flow === "quiz" && (
          <QuizOverlay
            step={step}
            answers={answers}
            onAnswer={answer}
            onBack={() => setStep((v) => Math.max(0, v - 1))}
            onClose={() => setFlow("landing")}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {flow === "brewing" && (
          <BrewAnimation
            tea={tea}
            onDone={() => {
              setFlow("result");
              window.setTimeout(
                () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
                50,
              );
            }}
          />
        )}
      </AnimatePresence>
      {flow === "result" && (
        <ResultExperience tea={tea} answers={answers} onRestart={restart} resultRef={resultRef} />
      )}
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow && <p className="mb-2 text-xs font-black uppercase text-brand-warm">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function ResultExperience({
  tea,
  answers,
  onRestart,
  resultRef,
}: {
  tea: Tea;
  answers: number[];
  onRestart: () => void;
  resultRef: React.RefObject<HTMLDivElement | null>;
}) {
  const info = TEA_INFO[tea];
  return (
    <motion.div
      ref={resultRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-brand-deep/10 bg-brand-paper"
    >
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-highlight px-4 py-2 text-sm font-bold text-highlight-foreground">
            오늘의 오당차
          </span>
          <Button variant="link" onClick={onRestart} className="px-0 text-muted-foreground">
            다시 테스트하기
          </Button>
        </div>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-lg font-bold">당신에게 어울리는 차고는</p>
            <h2 className="mt-3 font-display text-6xl font-black text-brand-warm sm:text-8xl">
              {tea}
            </h2>
            <p className="mt-4 text-xl font-bold">{info.copy}</p>
            <div className="mt-9 border-l-2 border-brand-warm pl-5">
              <h3 className="font-bold">왜 이 차고를 추천했을까요?</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{buildReason(answers, tea)}</p>
            </div>
          </div>
          <div
            className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-2xl border border-brand-deep/10 bg-card shadow-soft"
            style={{ background: `color-mix(in oklab, ${info.soft} 24%, var(--card))` }}
          >
            <TeaCup compact />
            <span className="absolute bottom-5 rounded-full bg-card/80 px-3 py-1.5 text-[11px] text-muted-foreground">
              제품 이미지 자리
            </span>
          </div>
        </div>
      </section>
      <SignupSection tea={tea} />
      <HowTo />
      <Extras tea={tea} info={info} />
    </motion.div>
  );
}

function SignupSection({ tea }: { tea: Tea }) {
  const [counts, setCounts] = useState<Counts>(
    TIMESLOTS.map((time) => ({ time, count: 0, capacity: SLOT_CAPACITY })),
  );
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);
  const refresh = () =>
    getSlotCounts()
      .then(setCounts)
      .catch(() => toast.error("시간대 정보를 불러오지 못했어요."));
  useEffect(() => {
    void refresh();
  }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slot) return toast.error("참여 시간대를 골라주세요.");
    setSaving(true);
    try {
      await submitSignup({
        data: { name, contact, teaResult: tea, timeslot: slot as (typeof TIMESLOTS)[number] },
      });
      setComplete(true);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "신청하지 못했어요.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="border-y border-brand-deep/10 bg-background px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle
          eyebrow="TEA MEETING"
          title="오당차 결과로 다회 매칭 신청하기"
          description="같은 취향의 사람들과 짧은 다회 소개팅을 즐겨보세요. 참여 가능한 시간대를 선택해주세요."
        />
        {complete ? (
          <div className="mt-10 rounded-2xl bg-card p-6 shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-leaf text-primary-foreground">
              <Check />
            </div>
            <h3 className="mt-5 text-xl font-black">
              신청 완료! {slot} 타임 참여자 명단에 등록되었어요.
            </h3>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">이름</dt>
                <dd className="mt-1 font-bold">{name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">추천 차</dt>
                <dd className="mt-1 font-bold">{tea}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">시간</dt>
                <dd className="mt-1 font-bold">{slot}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {counts.map(({ time, count, capacity }) => {
                const full = count >= capacity;
                return (
                  <Button
                    type="button"
                    variant={slot === time ? "default" : "outline"}
                    disabled={full}
                    onClick={() => setSlot(time)}
                    key={time}
                    className="h-20 flex-col rounded-xl bg-card"
                  >
                    <span className="text-lg font-black">{time}</span>
                    <span className="text-xs font-normal opacity-70">
                      {full ? "마감" : `${capacity - count}자리 남음`}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">
                이름
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={1}
                  maxLength={50}
                  required
                  placeholder="이름을 입력해주세요"
                  className="mt-2 h-12 rounded-xl bg-card"
                />
              </label>
              <label className="text-sm font-bold">
                연락처
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  minLength={2}
                  maxLength={100}
                  required
                  placeholder="전화번호 또는 인스타그램"
                  className="mt-2 h-12 rounded-xl bg-card"
                />
              </label>
            </div>
            <Button
              type="submit"
              disabled={saving || !slot}
              className="mt-5 h-12 w-full rounded-xl sm:w-auto"
            >
              {saving ? "신청 중..." : "선택한 시간으로 신청하기"}
              <ArrowRight />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

const steps = [
  { icon: Sparkles, title: "차고를 컵에 넣기" },
  { icon: Droplets, title: "물 넣기" },
  { icon: Coffee, title: "녹이기" },
  { icon: Heart, title: "마시기" },
];
function HowTo() {
  return (
    <section className="px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="JUST 4 STEPS"
          title="차고가 처음이라면?"
          description="물을 넣으면 바로 마시는 차. 딱 4단계예요."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title }, index) => (
            <div
              key={title}
              className="rounded-2xl border border-brand-deep/10 bg-card p-5 shadow-soft"
            >
              <span className="text-xs font-black text-brand-warm">0{index + 1}</span>
              <Icon className="my-7 h-9 w-9 text-brand-leaf" />
              <p className="font-bold">{title}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-13 rounded-xl">
            <a href={SHOP_URL} target="_blank" rel="noreferrer">
              이 차고 마셔보기 <ExternalLink />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-13 rounded-xl"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            다른 차고도 비교해보기
          </Button>
        </div>
      </div>
    </section>
  );
}

function Extras({ tea, info }: { tea: Tea; info: (typeof TEA_INFO)[Tea] }) {
  const [rating, setRating] = useState(0);
  const shareRef = useRef<HTMLDivElement>(null);
  const copy = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  };
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const share = async () => {
    if (navigator.share)
      await navigator.share({ title: `나의 오당차는 ${tea}`, text: info.copy, url: shareUrl });
    else await copy(shareUrl, "공유 링크를 복사했어요.");
  };
  const save = async () => {
    if (!shareRef.current) return;
    const url = await toPng(shareRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `odangcha-${tea}.png`;
    link.href = url;
    link.click();
  };
  return (
    <>
      <section className="bg-brand-deep px-5 py-16 text-primary-foreground sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
            <p className="text-xs font-bold text-brand-warm">NEW CUSTOMER COUPON</p>
            <h3 className="mt-3 text-2xl font-black">오늘의 추천 차고 10% 할인</h3>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-3">
              <code className="font-bold">{COUPON_CODE}</code>
              <Button
                variant="secondary"
                onClick={() => copy(COUPON_CODE, "쿠폰 코드를 복사했어요.")}
              >
                <Copy /> 쿠폰 받기
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
            <p className="font-bold leading-6">
              차고를 처음 접했을 때,
              <br />
              어떻게 먹는 제품인지 이해하기 쉬웠나요?
            </p>
            <div className="mt-6 flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <Button
                  key={score}
                  variant={rating === score ? "secondary" : "outline"}
                  size="icon"
                  aria-label={`${score}점`}
                  onClick={() => setRating(score)}
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:text-foreground"
                >
                  {score}
                </Button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-4 text-sm text-primary-foreground/70">
                소중한 의견 고마워요. 더 쉬운 차 한잔을 만들게요.
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="px-5 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="SHARE YOUR TEA" title="내 오당차 결과 공유하기" />
          <div
            ref={shareRef}
            className="mt-9 rounded-2xl border border-brand-deep/10 bg-card p-7 shadow-lift sm:p-10"
            style={{ background: `color-mix(in oklab, ${info.soft} 18%, var(--card))` }}
          >
            <div className="flex items-center justify-between">
              <b>백다담</b>
              <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold">
                오늘의 오당차
              </span>
            </div>
            <p className="mt-16 text-sm font-bold text-muted-foreground">
              오늘, 나에게 어울리는 차고
            </p>
            <h3 className="mt-2 font-display text-5xl font-black text-brand-warm sm:text-7xl">
              {tea}
            </h3>
            <p className="mt-3 text-lg font-bold">{info.copy}</p>
            <p className="mt-14 break-all text-xs text-muted-foreground">{shareUrl}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Button onClick={share} className="h-12 rounded-xl">
              <Share2 /> 공유하기
            </Button>
            <Button variant="outline" onClick={save} className="h-12 rounded-xl">
              <Download /> 공유 카드 저장
            </Button>
            <Button
              variant="outline"
              onClick={() => copy(shareUrl, "링크를 복사했어요.")}
              className="h-12 rounded-xl"
            >
              <Copy /> 링크 복사
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
