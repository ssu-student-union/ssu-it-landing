import { describe, expect, it } from "vitest";
import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

type CheckboxMatrixField = Extract<FieldConfig, { type: "checkbox-matrix" }>;

function build(dates: { id: string; start: string; end: string }[]) {
  const field = buildInterviewField({ dates }) as CheckboxMatrixField;
  return field;
}

describe("buildInterviewField", () => {
  it("평일/주말 날짜를 각각 다른 그룹으로 나눈다", () => {
    // 2026-08-01/02는 주말(토/일), 2026-08-03은 평일(월)이다.
    const field = build([
      { id: "2026-08-01", start: "13:00", end: "20:00" },
      { id: "2026-08-02", start: "12:00", end: "20:00" },
      { id: "2026-08-03", start: "19:00", end: "22:00" },
    ]);

    expect(field.groups).toHaveLength(2);
    const [weekday, weekend] = field.groups;
    expect(weekday.cornerLabel).toBe("평일");
    expect(weekday.rows.map((r) => r.id)).toEqual(["2026-08-03"]);
    expect(weekend.cornerLabel).toBe("주말");
    expect(weekend.rows.map((r) => r.id)).toEqual(["2026-08-01", "2026-08-02"]);
  });

  it("그룹의 열은 그룹 내 날짜들의 시간대 합집합을 오름차순으로 담는다", () => {
    const field = build([
      { id: "2026-08-01", start: "13:00", end: "16:00" },
      { id: "2026-08-02", start: "12:00", end: "14:00" },
    ]);
    const [weekend] = field.groups;
    expect(weekend.slots).toEqual(["12:00", "13:00", "14:00", "15:00"]);
  });

  it("isSlotAvailable은 그 날짜 자신의 시간대에서만 true를 반환한다", () => {
    const field = build([
      { id: "2026-08-01", start: "13:00", end: "16:00" },
      { id: "2026-08-02", start: "12:00", end: "14:00" },
    ]);
    const [weekend] = field.groups;

    // 8/1은 13:00~16:00(슬롯 13,14,15시)만 가능, 8/2는 12:00~14:00(슬롯 12,13시)만 가능.
    expect(weekend.isSlotAvailable?.("2026-08-01", "12:00")).toBe(false);
    expect(weekend.isSlotAvailable?.("2026-08-01", "13:00")).toBe(true);
    expect(weekend.isSlotAvailable?.("2026-08-02", "12:00")).toBe(true);
    expect(weekend.isSlotAvailable?.("2026-08-02", "14:00")).toBe(false);
  });

  it("날짜가 없는 그룹(평일 또는 주말)은 groups 배열에서 아예 빠진다", () => {
    const field = build([{ id: "2026-08-01", start: "13:00", end: "16:00" }]);
    expect(field.groups).toHaveLength(1);
    expect(field.groups[0].cornerLabel).toBe("주말");
  });
});
