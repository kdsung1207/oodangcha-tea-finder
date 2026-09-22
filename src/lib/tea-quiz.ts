export const TEAS = [
  "루이보스차",
  "홍차",
  "보이차",
  "우롱차",
  "말차",
  "호지차",
  "히비스커스티",
] as const;
export type Tea = (typeof TEAS)[number];
export type Weights = Partial<Record<Tea, number>>;

export const TEA_INFO: Record<
  Tea,
  { copy: string; note: string; color: string; soft: string; image?: string }
> = {
  루이보스차: {
    copy: "오늘의 속도를 다독이는 편안한 한 잔",
    note: "부드럽고 맑은 여운",
    color: "var(--tea-rooibos)",
    soft: "var(--tea-rooibos-soft)",
    image: "/tea/rooibos.jpg",
  },
  홍차: {
    copy: "분주한 하루에 깊이를 더하는 한 잔",
    note: "풍부하고 클래식한 향",
    color: "var(--tea-black)",
    soft: "var(--tea-black-soft)",
    image: "/tea/black.jpg",
  },
  보이차: {
    copy: "묵직한 중심이 필요한 오늘을 위한 한 잔",
    note: "깊고 차분한 풍미",
    color: "var(--tea-puer)",
    soft: "var(--tea-puer-soft)",
    image: "/tea/puer.jpg",
  },
  우롱차: {
    copy: "기분 좋은 집중을 오래 이어주는 한 잔",
    note: "향긋하고 산뜻한 밸런스",
    color: "var(--tea-oolong)",
    soft: "var(--tea-oolong-soft)",
    image: "/tea/oolong.jpg",
  },
  말차: {
    copy: "선명한 에너지로 오늘을 깨우는 한 잔",
    note: "쌉쌀하고 생생한 녹음",
    color: "var(--tea-matcha)",
    soft: "var(--tea-matcha-soft)",
  },
  호지차: {
    copy: "고소한 온기로 하루를 감싸는 한 잔",
    note: "구수하고 편안한 향",
    color: "var(--tea-hojicha)",
    soft: "var(--tea-hojicha-soft)",
  },
  히비스커스티: {
    copy: "산뜻한 전환이 필요한 순간의 한 잔",
    note: "상큼하고 생기 있는 맛",
    color: "var(--tea-hibiscus)",
    soft: "var(--tea-hibiscus-soft)",
  },
};

type Option = { label: string; weights: Weights };
export type QuizQuestion = { title: string; options: Option[] };

export const QUESTIONS: QuizQuestion[] = [
  {
    title: "내 하루의 모습은?",
    options: [
      { label: "바쁘고 정신없는 하루", weights: { 말차: 3, 홍차: 2, 우롱차: 1 } },
      { label: "여유롭고 느긋한 하루", weights: { 루이보스차: 3, 호지차: 2, 보이차: 1 } },
      { label: "집중력이 필요한 업무 위주", weights: { 말차: 3, 우롱차: 3, 홍차: 1 } },
      { label: "사람 만날 일이 많은 하루", weights: { 히비스커스티: 3, 홍차: 2, 우롱차: 1 } },
    ],
  },
  {
    title: "가장 자주 마시는 음료는?",
    options: [
      { label: "커피", weights: { 보이차: 3, 홍차: 2, 말차: 1 } },
      { label: "탄산음료", weights: { 히비스커스티: 3, 우롱차: 1 } },
      { label: "물·생수", weights: { 루이보스차: 3, 우롱차: 2 } },
      { label: "이미 차를 즐겨 마심", weights: { 보이차: 2, 호지차: 2, 홍차: 1 } },
    ],
  },
  {
    title: "음료를 고를 때 가장 중시하는 부분은?",
    options: [
      { label: "건강·성분", weights: { 루이보스차: 3, 보이차: 2, 말차: 1 } },
      { label: "맛과 향", weights: { 홍차: 3, 우롱차: 2, 호지차: 1 } },
      { label: "편의성", weights: { 말차: 2, 우롱차: 2, 루이보스차: 1 } },
      { label: "기분 전환·힐링", weights: { 히비스커스티: 3, 호지차: 2, 루이보스차: 1 } },
    ],
  },
  {
    title: "음료를 가장 많이 마시는 시간은?",
    options: [
      { label: "아침 출근길", weights: { 말차: 3, 홍차: 2 } },
      { label: "점심 식후", weights: { 보이차: 3, 우롱차: 2 } },
      { label: "오후 나른할 때", weights: { 우롱차: 3, 히비스커스티: 2, 말차: 1 } },
      { label: "자기 전 저녁", weights: { 루이보스차: 4, 호지차: 3 } },
    ],
  },
  {
    title: "평소 차를 잘 마시지 않는 이유는?",
    options: [
      { label: "만드는 게 번거로워서", weights: { 우롱차: 2, 루이보스차: 2, 히비스커스티: 1 } },
      { label: "어떤 차를 골라야 할지 몰라서", weights: { 홍차: 2, 호지차: 2, 우롱차: 1 } },
      { label: "맛이 심심해서", weights: { 보이차: 3, 말차: 2, 히비스커스티: 2 } },
      { label: "카페인이 걱정돼서", weights: { 루이보스차: 4, 호지차: 3 } },
    ],
  },
  {
    title: "새로운 음료를 고를 때 끌리는 맛은?",
    options: [
      { label: "은은하고 깔끔한 맛", weights: { 루이보스차: 3, 우롱차: 2 } },
      { label: "진하고 묵직한 맛", weights: { 보이차: 4, 홍차: 3 } },
      { label: "고소하고 부드러운 맛", weights: { 호지차: 4, 말차: 1 } },
      { label: "상큼하고 새콤한 맛", weights: { 히비스커스티: 5 } },
    ],
  },
];

export function calculateTeaResult(answers: number[]): Tea {
  const scores = Object.fromEntries(TEAS.map((tea) => [tea, 0])) as Record<Tea, number>;
  answers.forEach((answer, questionIndex) => {
    const weights = QUESTIONS[questionIndex]?.options[answer]?.weights ?? {};
    TEAS.forEach((tea) => {
      scores[tea] += weights[tea] ?? 0;
    });
  });
  return TEAS.reduce((best, tea) => (scores[tea] > scores[best] ? tea : best), TEAS[0]);
}

export function buildReason(answers: number[], tea: Tea) {
  const labels = answers
    .map((answer, index) => QUESTIONS[index]?.options[answer]?.label)
    .filter(Boolean);
  const flavor = labels[5] ?? "선호하는 맛";
  const moment = labels[3] ?? "자주 차를 찾는 시간";
  return `${flavor}을 끌려 하고, ${moment}에 음료를 즐기는 당신의 선택이 돋보였어요. ${TEA_INFO[tea].note}을 지닌 ${tea}가 오늘의 리듬에 자연스럽게 어울립니다.`;
}

export const TIMESLOTS = ["13:00", "14:00", "15:00", "16:00"] as const;
export const SLOT_CAPACITY = 8;
export const SHOP_URL = "https://baekdadam.com";
export const COUPON_CODE = "ODANGCHA10";
