import {
  ACTIVITY_PERIOD,
  ANNOUNCEMENT_DATE,
  APPLICATION_PERIOD,
  DOCUMENT_RESULT_DATE,
  formatDotDate,
  formatShortDate,
  formatSlashDate,
  formatYearMonth,
  GENERAL_MEETING_DATE,
  INTERVIEW_DATES,
  NEXT_RECRUITING_ROUND_DATE,
} from "../../../data/recruitingSchedule";

/** Hero가 쓰는 카피/설정. 나머지 랜딩 섹션 카피는 아래에 이어 둔다. */
export const hero = {
  title: "5기 모집 시작!",
  /** 지원 마감일. D-day 계산 기준일이기도 하다. */
  deadline: "2026-07-30",
  applyHref: "/recruiting/personal-info",
} as const;

/** 불릿 리스트(개요·파트)의 라벨/값 한 행. */
export type KeyValue = {
  label: string;
  value: string;
  /** 괄호 보조: "muted"=연한 회색, "emphasis"=굵게. */
  aside?: { text: string; tone: "muted" | "emphasis" };
  /** 마감된 파트("모집 X") 등 흐리게 처리. */
  dimmed?: boolean;
};

// 날짜류는 recruitingSchedule.ts(단일 소스)에서 파생한다. 값이 now에 의존하지 않는
// 상수 포맷이라 서버/클라이언트 렌더가 어긋나지 않는다.
export const overview = {
  title: "모집 개요",
  rows: [
    { label: "모집 기수", value: "5기 신규 위원" },
    {
      label: "모집 대상",
      value: "숭실대학교 학생 누구나",
      aside: { text: "(전공 무관)", tone: "muted" },
    },
    {
      label: "활동 기간",
      value: `${formatYearMonth(ACTIVITY_PERIOD.start)} ~ ${formatYearMonth(ACTIVITY_PERIOD.end)}`,
      aside: { text: "(1년 활동 원칙)", tone: "emphasis" },
    },
    {
      label: "활동 방식",
      value: "전체회의 : 월 1회 TF별 회의 : TF별 상이 + 상시 협업",
    },
    { label: "지원 기간", value: `~${formatDotDate(APPLICATION_PERIOD.end)}` },
    { label: "활동 혜택", value: "실무 프로젝트 경험, OB 네트워크, 수료증 등" },
  ] satisfies KeyValue[],
} as const;

/** 모집 파트 표 한 행. Figma의 "1~2명 (TF무관)" 값을 인원/비고 열로 정규화한다. */
export type PartRow = {
  part: string;
  count: string;
  note: string;
  /** 마감 파트(Frontend) → 행 전체를 흐리게. */
  dimmed?: boolean;
};

export const parts = {
  title: "모집 파트별 인원/자격/우대사항",
  cornerLabel: "파트",
  columns: ["인원", "자격 · 우대사항"],
  rows: [
    { part: "PM", count: "1~2명", note: "TF 무관" },
    { part: "Design", count: "2명", note: "-" },
    { part: "Frontend", count: "0명", note: "", dimmed: true },
    {
      part: "Backend",
      count: "6명",
      note: "TF 이외 AWS/SSO 관련 기술 보유자 필요",
    },
    { part: "HR", count: "1~2명", note: "TF 무관" },
  ] satisfies PartRow[],
} as const;

export type IdealCard = { emoji: string; title: string; body: string };

export const ideal = {
  title: "저희는 이런 분을 찾습니다!",
  cards: [
    {
      emoji: "📌",
      title: "의사소통이 원활한 분",
      body: "서로의 의견을 존중하며, 능동적으로 소통하고 피드백을 주고받는 과정을 즐길 수 있는 분을 찾습니다.",
    },
    {
      emoji: "📖",
      title: "자신의 리소스를 파악하고 책임감 있게 일하는 분",
      body: "무리하게 여러 일을 맡아 손해를 보는 것이 아니라, 자신이 감당할 수 있는 범위를 파악하고 책임감 있게 업무를 수행하는 능력이 필요합니다.",
    },
    {
      emoji: "🔍",
      title: "학생사회에 기여하고 싶은 분",
      body: "IT지원위원회는 학생들을 위한 서비스를 만드는 조직입니다. 학생사회를 이해하고 실질적인 변화를 만들고 싶은 사람이라면 더욱 환영합니다.",
    },
    {
      emoji: "🚩",
      title: "밀도있는 성장을 원하는 분",
      body: "IT지원위원회는 실제 사용자가 있는 서비스를 운영하는 환경을 제공합니다. 기술적·실무적 역량을 키우고, 도전적인 환경에서 성장하고 싶은 분을 기다립니다.",
    },
  ] satisfies IdealCard[],
} as const;

export type Contact = { label: string; value: string; href: string };

export const notes = {
  title: "지원 유의사항",
  bullets: [
    "숭실대학교 재학생·휴학생 모두 지원 가능합니다.",
    "지원은 1개 파트에만 가능합니다.",
    `합격 시 8월 전체 회의(${formatSlashDate(GENERAL_MEETING_DATE)} 예정)에 필참해야 하며, 최소 2학기 활동을 원칙으로 합니다.`,
    "선발은 '서류 → 면접' 순으로 진행되며, 결과는 개별 안내됩니다.",
    "제출된 지원서는 채용 목적 외 사용되지 않으며, 마감 후 수정·추가 제출은 불가합니다.",
    `지원 마감: ${formatDotDate(APPLICATION_PERIOD.end)} 23:59 (마감 후 접수 불가)`,
  ],
  contactIntro: "궁금한 점은 아래 채널로 편하게 문의해주세요!",
  contactNote: "평일 기준 1~2일 내 답변드려요",
  contacts: [
    {
      label: "Instagram",
      value: "@ssu_it_support",
      href: "https://instagram.com/ssu_it_support",
    },
    {
      label: "Email",
      value: "ssudeveloper2024@gmail.com",
      href: "mailto:ssudeveloper2024@gmail.com",
    },
    {
      label: "kakao",
      value: "http://pf.kakao.com/_SRGqn",
      href: "http://pf.kakao.com/_SRGqn",
    },
  ] satisfies Contact[],
} as const;

/** 지원 기간이 아닐 때 Hero 자리를 대체하는 마감 안내 카피. */
export const closedNotice = {
  headlineLines: ["모집 기간이 되면 메일로 알려드릴게요", "감사합니다!"],
  nextRoundLabel: `6기 모집 예정 날짜: ${formatYearMonth(NEXT_RECRUITING_ROUND_DATE)}`,
  emailPlaceholder: "ex. abc123@gmail.com",
  submitLabel: "알림 신청하기",
} as const;

export const timeline = { title: "모집 일정" } as const;

export type TimelineItem = { label: string; date: string; last: boolean };

/** 모집 일정 타임라인 — 날짜를 schedule.ts에서 파생해 구성한다. */
export const buildTimelineItems = (): TimelineItem[] => {
  const interviewStart = INTERVIEW_DATES[0];
  const interviewEnd = INTERVIEW_DATES[INTERVIEW_DATES.length - 1];
  const rows = [
    {
      label: "신입위원 모집",
      date: `${formatShortDate(APPLICATION_PERIOD.start)} ~ ${formatShortDate(APPLICATION_PERIOD.end)}`,
    },
    { label: "서류 평가", date: `~${formatShortDate(DOCUMENT_RESULT_DATE)}` },
    {
      label: "면접 평가",
      date: `${formatShortDate(interviewStart)} ~ ${formatShortDate(interviewEnd)}`,
    },
    { label: "최종 발표", date: formatShortDate(ANNOUNCEMENT_DATE) },
    {
      label: "IT지원위원회 전체 회의",
      date: formatShortDate(GENERAL_MEETING_DATE),
    },
  ];
  return rows.map((row, i) => ({ ...row, last: i === rows.length - 1 }));
};
