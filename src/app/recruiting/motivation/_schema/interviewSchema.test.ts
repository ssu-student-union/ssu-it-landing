import { describe, expect, it } from "vitest";
import {
  INTERVIEW_DATES,
  WEEKDAY_SLOT_START_TIMES,
  WEEKEND_SLOT_START_TIMES,
} from "../../../../data/recruitingSchedule";
import type { FieldConfig } from "../../_lib/schema";
import {
  buildInterviewAvailabilityField,
  validateInterviewAvailability,
} from "./interviewSchema";
import { collectIssues } from "./testHelpers";

const fieldsWithMatrix: FieldConfig[] = [
  {
    type: "checkbox-matrix",
    key: "interviewAvailability",
    groups: [
      {
        columns: ["19:00", "20:00"],
        rows: [{ id: "2026-08-01", label: "8/1" }],
        slots: ["19:00", "20:00"],
      },
      {
        columns: ["10:00"],
        rows: [{ id: "2026-08-02", label: "8/2" }],
        slots: ["10:00"],
      },
    ],
    getChecked: () => false,
    onToggle: (values) => values,
  },
];

describe("buildInterviewAvailabilityField", () => {
  it("표에 있는 날짜/시간대 조합은 통과한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-08-01": ["19:00"] });
    expect(result.success).toBe(true);
  });

  it("표에 없는 날짜는 거부한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-09-01": ["19:00"] });
    expect(result.success).toBe(false);
  });

  it("어느 그룹에도 없는 시간대는 날짜와 무관하게 거부한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-08-01": ["23:00"] });
    expect(result.success).toBe(false);
  });

  it("허용 시간대는 그룹 경계와 무관하게 모든 그룹의 slot을 합친 풀이다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-08-01": ["10:00"] });
    expect(result.success).toBe(true);
  });

  it("빈 객체는 기본값으로 통과한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("checkbox-matrix 필드가 없으면 전체 날짜/시간대 풀로 폴백한다", () => {
    const schema = buildInterviewAvailabilityField([]);
    const validDate = INTERVIEW_DATES[0];
    const validSlot = WEEKDAY_SLOT_START_TIMES[0];
    expect(schema.safeParse({ [validDate]: [validSlot] }).success).toBe(true);
    expect(schema.safeParse({ "1999-01-01": [validSlot] }).success).toBe(false);
  });

  it("폴백 풀은 평일+주말 시간대를 모두 포함한다", () => {
    const schema = buildInterviewAvailabilityField([]);
    const validDate = INTERVIEW_DATES[0];
    const weekendSlot = WEEKEND_SLOT_START_TIMES[0];
    expect(schema.safeParse({ [validDate]: [weekendSlot] }).success).toBe(true);
  });
});

describe("validateInterviewAvailability", () => {
  function issuesOf(data: {
    interviewAvailability: Partial<Record<string, string[]>>;
    noAvailableTime: boolean;
  }) {
    return collectIssues((ctx) => validateInterviewAvailability(data, ctx));
  }

  it("noAvailableTime이 true면 검증을 건너뛴다", () => {
    expect(
      issuesOf({ interviewAvailability: {}, noAvailableTime: true }),
    ).toHaveLength(0);
  });

  it("noAvailableTime이 false이고 선택값이 없으면 issue를 추가한다", () => {
    const issues = issuesOf({
      interviewAvailability: {},
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toEqual(["interviewAvailability"]);
  });

  it("빈 배열만 있는 경우도 선택 안 한 것으로 취급한다", () => {
    const issues = issuesOf({
      interviewAvailability: { "2026-08-01": [] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(1);
  });

  it("하나라도 선택돼 있으면 통과한다", () => {
    const issues = issuesOf({
      interviewAvailability: { "2026-08-01": ["19:00"] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(0);
  });
});
