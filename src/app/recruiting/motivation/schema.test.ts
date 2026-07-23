import { describe, expect, it } from "vitest";
import { buildStepTwoSchema, stepTwoInitialValues } from "./schema";

const validPmData = {
  ...stepTwoInitialValues,
  department: "pm",
  interviewAvailability: {},
  noAvailableTime: true,
  otherTime: [{ start: "2026-02-01T19:00", end: "2026-02-01T20:00" }],
  taskPriorities: {
    "student-council-site": "1",
    "club-council-site": "2",
    ssuport: "3",
    etc: "4",
  },
  motivation: "지원 동기입니다.",
  fitReason: "인재상에 부합하는 이유입니다.",
  priorityTaskStrategy: "1순위 과제 해결 전략입니다.",
};

describe("buildStepTwoSchema", () => {
  it("department가 비어있으면 실패한다", () => {
    const schema = buildStepTwoSchema("");
    const result = schema.safeParse({
      ...stepTwoInitialValues,
      department: "",
    });
    expect(result.success).toBe(false);
  });

  it("PM 부서의 유효한 데이터는 통과한다", () => {
    const schema = buildStepTwoSchema("pm");
    const result = schema.safeParse(validPmData);
    expect(result.success).toBe(true);
  });

  it("PM 부서에서 taskPriorities를 다 채우지 않으면 실패한다", () => {
    const schema = buildStepTwoSchema("pm");
    const result = schema.safeParse({
      ...validPmData,
      taskPriorities: { "student-council-site": "1" },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.taskPriorities?.[0],
      ).toBeDefined();
    }
  });

  it("PM 부서에서 공통 문항(motivation)이 비어있으면 실패한다", () => {
    const schema = buildStepTwoSchema("pm");
    const result = schema.safeParse({ ...validPmData, motivation: "" });
    expect(result.success).toBe(false);
  });

  it("Frontend 부서는 techStack/projectExperience에 2000자 제한이 적용된다", () => {
    const schema = buildStepTwoSchema("frontend");
    const tooLong = "a".repeat(2001);
    const result = schema.safeParse({
      ...stepTwoInitialValues,
      department: "frontend",
      interviewAvailability: {},
      noAvailableTime: true,
      otherTime: [{ start: "2026-02-01T19:00", end: "2026-02-01T20:00" }],
      motivation: "지원 동기",
      fitReason: "인재상 부합 이유",
      techStack: tooLong,
      projectExperience: "프로젝트 경험",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.techStack?.[0]).toBeDefined();
    }
  });
});
