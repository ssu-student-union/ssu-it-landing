import { dayjs } from "../lib";

/** `<input type="datetime-local">` 값 포맷. 대체 일정 검증(strict parse)에서 재사용한다. */
export const LOCAL_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm";

// 5기 신입위원 모집(지원) 기간 — 랜딩·지원 폼이 공유하는 단일 소스.
export const APPLICATION_PERIOD = {
  start: "2026-07-23",
  end: "2026-07-30",
} as const;

// 최종 발표일
export const ANNOUNCEMENT_DATE = "2026-08-05";

// 서류 평가 마감일
export const DOCUMENT_RESULT_DATE = "2026-07-31";

// 첫 전체 회의 일정
export const GENERAL_MEETING_DATE = "2026-08-20";

// 신입 기수 활동 기간
export const ACTIVITY_PERIOD = {
  start: "2026-08",
  end: "2027-08",
} as const;

// 다음 기수 모집 예정일
export const NEXT_RECRUITING_ROUND_DATE = "2027-02-28";

export const INTERVIEW_DATES = [
  "2026-08-01",
  "2026-08-02",
  "2026-08-03",
] as const;

export const INTERVIEW_SLOT_DURATION_MINUTES = 60;

export const WEEKDAY_SLOT_START_TIMES = ["19:00", "20:00", "21:00"] as const;
export const WEEKEND_SLOT_START_TIMES = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const isWeekendDate = (dateIso: string): boolean => {
  const day = dayjs(`${dateIso}T00:00:00`).day();
  return day === 0 || day === 6;
};

/** "2026-02-02" → "2월 2일 (월)" */
export const formatInterviewDate = (dateIso: string): string => {
  return dayjs(`${dateIso}T00:00:00`).format("M월 D일 (ddd)");
};

/** "2026-07-31" → "7/31(금)" */
export const formatShortDate = (dateIso: string): string => {
  return dayjs(`${dateIso}T00:00:00`).format("M/D(ddd)");
};

/** "2026-07-30" → "2026.07.30" */
export const formatDotDate = (dateIso: string): string => {
  return dayjs(`${dateIso}T00:00:00`).format("YYYY.MM.DD");
};

/** "2026-09" → "2026.09" */
export const formatYearMonth = (yearMonth: string): string => {
  return dayjs(`${yearMonth}-01T00:00:00`).format("YYYY.MM");
};

/** "2026-08-20" → "8/20" */
export const formatSlashDate = (dateIso: string): string => {
  return dayjs(`${dateIso}T00:00:00`).format("M/D");
};

/** "19:00" → "19:00 ~ 20:00" */
export const formatSlotLabel = (startTime: string): string => {
  const start = dayjs(`2000-01-01T${startTime}`);
  const end = start.add(INTERVIEW_SLOT_DURATION_MINUTES, "minute");
  return `${startTime} ~ ${end.format("HH:mm")}`;
};

/** "13:00"~"20:00" 같은 연속 구간을 INTERVIEW_SLOT_DURATION_MINUTES 단위 시작 시각 목록으로 바꾼다. */
export const expandTimeRangeToSlots = (
  start: string,
  end: string,
): string[] => {
  const slots: string[] = [];
  const rangeEnd = dayjs(`2000-01-01T${end}`);
  let cursor = dayjs(`2000-01-01T${start}`);
  while (
    cursor
      .add(INTERVIEW_SLOT_DURATION_MINUTES, "minute")
      .isSameOrBefore(rangeEnd)
  ) {
    slots.push(cursor.format("HH:mm"));
    cursor = cursor.add(INTERVIEW_SLOT_DURATION_MINUTES, "minute");
  }
  return slots;
};

/** 현재 시각 기준 모집 기간 내에 포함되는지 여부 */
export const isApplicationActive = (): boolean => {
  const now = dayjs();
  return now.isBetween(
    APPLICATION_PERIOD.start,
    APPLICATION_PERIOD.end,
    "day",
    "[]",
  );
};

export const checkApplicationActiveClient = (): boolean => {
  if (typeof window !== "undefined") {
    const mock = window.sessionStorage.getItem("MOCK_RECRUITING_ACTIVE");
    if (mock !== null) {
      return mock === "true";
    }
  }
  return isApplicationActive();
};

// 9번(면접 가능한 대체 일자/시간) DateTimePicker의 min/max — 면접 기간 전체
export const INTERVIEW_PERIOD_MIN = `${INTERVIEW_DATES[0]}T00:00`;
export const INTERVIEW_PERIOD_MAX = `${INTERVIEW_DATES[INTERVIEW_DATES.length - 1]}T23:59`;
