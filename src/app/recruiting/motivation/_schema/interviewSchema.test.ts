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

// 8/3은 항상 선택 가능, 8/1은 13:00만, 8/2는 10:00만 실제로 열려있는 날짜별 가용성 픽스처.
// 표는 행=시간대·열=날짜로 transpose돼 있다(interviewField.ts와 동일한 관례).
const fieldsWithMatrix: FieldConfig[] = [
  {
    type: "checkbox-matrix",
    key: "interviewAvailability",
    groups: [
      {
        columns: ["8/3"],
        rows: [
          { id: "19:00", label: "19:00" },
          { id: "20:00", label: "20:00" },
        ],
        slots: ["2026-08-03"],
        isSlotAvailable: () => true,
      },
      {
        columns: ["8/1", "8/2"],
        rows: [
          { id: "10:00", label: "10:00" },
          { id: "13:00", label: "13:00" },
        ],
        slots: ["2026-08-01", "2026-08-02"],
        isSlotAvailable: (rowId, slot) =>
          slot === "2026-08-01" ? rowId === "13:00" : rowId === "10:00",
      },
    ],
    getChecked: () => false,
    onToggle: (values) => values,
  },
];

describe("buildInterviewAvailabilityField", () => {
  it("표에 있는 날짜/시간대 조합은 통과한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-08-03": ["19:00"] });
    expect(result.success).toBe(true);
  });

  it("표에 없는 날짜는 거부한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-09-01": ["19:00"] });
    expect(result.success).toBe(false);
  });

  it("어느 그룹에도 없는 시간대는 날짜와 무관하게 거부한다", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    const result = schema.safeParse({ "2026-08-03": ["23:00"] });
    expect(result.success).toBe(false);
  });

  it("허용 시간대는 날짜별 실제 가능 시간의 합집합이라, 다른 날짜에서만 유효한 시간도 shape 단계에서는 통과한다(정밀 검증은 validateInterviewAvailability가 담당)", () => {
    const schema = buildInterviewAvailabilityField(fieldsWithMatrix);
    // "10:00"은 8/2에서만 실제로 열려있지만, 8/1에 넣어도 타입 shape는 통과한다.
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
  function issuesOf(
    fields: FieldConfig[],
    data: {
      interviewAvailability: Partial<Record<string, string[]>>;
      noAvailableTime: boolean;
    },
  ) {
    return collectIssues((ctx) =>
      validateInterviewAvailability(fields, data, ctx),
    );
  }

  it("noAvailableTime이 true면 검증을 건너뛴다", () => {
    expect(
      issuesOf([], { interviewAvailability: {}, noAvailableTime: true }),
    ).toHaveLength(0);
  });

  it("noAvailableTime이 false이고 선택값이 없으면 issue를 추가한다", () => {
    const issues = issuesOf([], {
      interviewAvailability: {},
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toEqual(["interviewAvailability"]);
  });

  it("빈 배열만 있는 경우도 선택 안 한 것으로 취급한다", () => {
    const issues = issuesOf([], {
      interviewAvailability: { "2026-08-01": [] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(1);
  });

  it("매트릭스 필드가 없으면(날짜별 검증 불가) 개수만 확인하고 통과한다", () => {
    const issues = issuesOf([], {
      interviewAvailability: { "2026-08-01": ["19:00"] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(0);
  });

  it("날짜에서 실제로 허용되지 않은 시간을 선택하면 issue를 추가한다(회귀: 날짜별 가용 시간)", () => {
    const issues = issuesOf(fieldsWithMatrix, {
      interviewAvailability: { "2026-08-01": ["10:00"] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toEqual(["interviewAvailability"]);
    expect(issues[0].message).toBe("선택할 수 없는 날짜/시간이에요.");
  });

  it("날짜에서 실제로 허용된 시간을 선택하면 통과한다", () => {
    const issues = issuesOf(fieldsWithMatrix, {
      interviewAvailability: { "2026-08-01": ["13:00"] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(0);
  });

  it("허용/비허용 시간을 함께 선택하면 비허용 시간에 대해서만 issue가 붙는다", () => {
    const issues = issuesOf(fieldsWithMatrix, {
      interviewAvailability: { "2026-08-01": ["13:00", "10:00"] },
      noAvailableTime: false,
    });
    expect(issues).toHaveLength(1);
  });
});
