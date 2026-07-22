import { describe, expect, it } from "vitest";
import {
  expandTimeRangeToSlots,
  formatInterviewDate,
  formatShortDate,
  formatSlotLabel,
} from "./recruitingSchedule";

describe("formatInterviewDate", () => {
  it("ISO 날짜를 'M월 D일 (요일)' 형식으로 바꾼다", () => {
    expect(formatInterviewDate("2026-08-01")).toBe("8월 1일 (토)");
  });
});

describe("formatShortDate", () => {
  it("ISO 날짜를 'M/D(요일)' 형식으로 바꾼다", () => {
    expect(formatShortDate("2026-08-01")).toBe("8/1(토)");
  });
});

describe("formatSlotLabel", () => {
  it("시작 시각에 슬롯 길이(60분)를 더한 종료 시각까지 범위로 보여준다", () => {
    expect(formatSlotLabel("19:00")).toBe("19:00 ~ 20:00");
  });
});

describe("expandTimeRangeToSlots", () => {
  it("연속 구간을 60분 단위 시작 시각 목록으로 바꾼다", () => {
    expect(expandTimeRangeToSlots("13:00", "20:00")).toEqual([
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ]);
  });

  it("정확히 슬롯 하나 길이의 구간은 시작 시각 하나만 반환한다", () => {
    expect(expandTimeRangeToSlots("19:00", "20:00")).toEqual(["19:00"]);
  });

  it("슬롯 길이보다 짧은 구간은 빈 배열을 반환한다", () => {
    expect(expandTimeRangeToSlots("19:00", "19:30")).toEqual([]);
  });
});
