export const APPLICATION_PERIOD = {
  start: "2026-02-01",
  end: "2026-02-05",
} as const;

// 면접(INTERVIEW_DATES) 종료 직후 — 확정되면 실제 발표일로 교체 (플레이스홀더).
export const ANNOUNCEMENT_DATE = "2026-02-13";

export const INTERVIEW_DATES = [
  "2026-02-02",
  "2026-02-03",
  "2026-02-04",
  "2026-02-05",
  "2026-02-07",
  "2026-02-08",
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
  const day = new Date(`${dateIso}T00:00:00`).getDay();
  return day === 0 || day === 6;
};

export const slotStartTimesFor = (dateIso: string): readonly string[] =>
  isWeekendDate(dateIso) ? WEEKEND_SLOT_START_TIMES : WEEKDAY_SLOT_START_TIMES;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

/** "2026-02-02" → "2월 2일 (월)" */
export const formatInterviewDate = (dateIso: string): string => {
  const d = new Date(`${dateIso}T00:00:00`);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY_LABELS[d.getDay()]})`;
};

/** "2026-07-31" → "7/31(금)" — complete 페이지의 짧은 표기용 */
export const formatShortDate = (dateIso: string): string => {
  const d = new Date(`${dateIso}T00:00:00`);
  return `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAY_LABELS[d.getDay()]})`;
};

/** "19:00" → "19:00 ~ 20:00" */
export const formatSlotLabel = (startTime: string): string => {
  const [h, m] = startTime.split(":").map(Number);
  const endTotal = h * 60 + m + INTERVIEW_SLOT_DURATION_MINUTES;
  const endH = String(Math.floor(endTotal / 60) % 24).padStart(2, "0");
  const endM = String(endTotal % 60).padStart(2, "0");
  return `${startTime} ~ ${endH}:${endM}`;
};

// 9번(면접 가능한 대체 일자/시간) DateTimePicker의 min/max — 면접 기간 전체
export const INTERVIEW_PERIOD_MIN = `${INTERVIEW_DATES[0]}T00:00`;
export const INTERVIEW_PERIOD_MAX = `${INTERVIEW_DATES[INTERVIEW_DATES.length - 1]}T23:59`;
