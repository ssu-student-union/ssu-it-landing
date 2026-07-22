import { describe, expect, it } from "vitest";
import {
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
