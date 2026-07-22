import { describe, expect, it } from "vitest";
import { stepTwoInitialValues } from "../../motivation/schema";
import { stepOneInitialValues } from "../../personal-info/schema";
import { stepThreeInitialValues } from "../../portfolio/schema";
import { validateSubmission } from "./validateSubmission";

const validStepOne = {
  ...stepOneInitialValues,
  agree: true,
  name: "홍길동",
  studentId: "20240000",
  phone: "010-1234-5678",
  college: "정보과학대학",
  major: "IT융합전공",
  grade: "2학년 1학기",
  department: "Frontend",
};

const validStepTwo = {
  ...stepTwoInitialValues,
  department: "Frontend",
  interviewAvailability: {},
  noAvailableTime: true,
  otherTime: [{ start: "2026-02-01T19:00", end: "2026-02-01T20:00" }],
  motivation: "지원 동기",
  fitReason: "인재상 부합 이유",
  techStack: "React, TypeScript",
  projectExperience: "여러 프로젝트를 진행했습니다.",
};

const validStepThree = {
  ...stepThreeInitialValues,
  portfolioLink: "https://example.com",
  activityCommitmentAck: true,
};

describe("validateSubmission", () => {
  it("3단계 모두 유효하면 성공하고 파싱된 데이터를 반환한다", () => {
    const result = validateSubmission({
      stepOne: validStepOne,
      stepTwo: validStepTwo,
      stepThree: validStepThree,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stepOne.name).toBe("홍길동");
    }
  });

  it("stepOne만 실패하면 stepTwo/stepThree의 errors는 빈 객체다", () => {
    const result = validateSubmission({
      stepOne: { ...validStepOne, agree: false },
      stepTwo: validStepTwo,
      stepThree: validStepThree,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.stepOne).not.toEqual({});
      expect(result.errors.stepTwo).toEqual({});
      expect(result.errors.stepThree).toEqual({});
    }
  });

  it("department가 없는 stepOne이면 extractDepartment가 빈 문자열로 처리해 예외를 던지지 않는다", () => {
    const result = validateSubmission({
      stepOne: null,
      stepTwo: validStepTwo,
      stepThree: validStepThree,
    });
    expect(result.success).toBe(false);
  });

  it("department가 문자열이 아니거나 유효하지 않은 stepOne도 예외 없이 처리한다", () => {
    const result = validateSubmission({
      stepOne: { department: 123 },
      stepTwo: validStepTwo,
      stepThree: validStepThree,
    });
    expect(result.success).toBe(false);
  });

  it("stepThree만 실패하면 다른 두 단계는 통과로 반영된다", () => {
    const result = validateSubmission({
      stepOne: validStepOne,
      stepTwo: validStepTwo,
      stepThree: { portfolioLink: "", portfolioFile: null },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.stepThree).not.toEqual({});
      expect(result.errors.stepOne).toEqual({});
      expect(result.errors.stepTwo).toEqual({});
    }
  });
});
