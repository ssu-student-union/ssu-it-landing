import { describe, expect, it } from "vitest";
import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

type CheckboxMatrixField = Extract<FieldConfig, { type: "checkbox-matrix" }>;

function build(dates: { id: string; start: string; end: string }[]) {
  return buildInterviewField({ dates }) as CheckboxMatrixField;
}

describe("buildInterviewField", () => {
  it("행은 시간대, 열은 날짜로 transpose된 표 하나에 담는다", () => {
    // 2026-08-01/02는 주말(토/일), 2026-08-03은 평일(월)이다.
    const field = build([
      { id: "2026-08-01", start: "13:00", end: "20:00" },
      { id: "2026-08-02", start: "12:00", end: "20:00" },
      { id: "2026-08-03", start: "19:00", end: "22:00" },
    ]);

    expect(field.groups).toHaveLength(1);
    const [group] = field.groups;
    expect(group.slots).toEqual(["2026-08-01", "2026-08-02", "2026-08-03"]);
  });

  it("행(시간대)은 모든 날짜들의 시간대 합집합을 오름차순으로 담는다", () => {
    const field = build([
      { id: "2026-08-01", start: "13:00", end: "16:00" },
      { id: "2026-08-02", start: "12:00", end: "14:00" },
    ]);
    const [group] = field.groups;
    expect(group.rows.map((r) => r.id)).toEqual([
      "12:00",
      "13:00",
      "14:00",
      "15:00",
    ]);
  });

  it("isSlotAvailable(시간, 날짜)은 그 날짜에 실제로 열려있는 시간에서만 true를 반환한다", () => {
    const field = build([
      { id: "2026-08-01", start: "13:00", end: "16:00" },
      { id: "2026-08-02", start: "12:00", end: "14:00" },
    ]);
    const [group] = field.groups;

    // 8/1은 13:00~16:00(슬롯 13,14,15시)만 가능, 8/2는 12:00~14:00(슬롯 12,13시)만 가능.
    expect(group.isSlotAvailable?.("12:00", "2026-08-01")).toBe(false);
    expect(group.isSlotAvailable?.("13:00", "2026-08-01")).toBe(true);
    expect(group.isSlotAvailable?.("12:00", "2026-08-02")).toBe(true);
    expect(group.isSlotAvailable?.("14:00", "2026-08-02")).toBe(false);
  });

  it("날짜가 없으면 groups 배열이 빈 배열이다", () => {
    const field = build([]);
    expect(field.groups).toHaveLength(0);
  });
});
