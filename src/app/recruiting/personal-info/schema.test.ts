import { describe, expect, it } from "vitest";
import { stepOneSchema } from "./schema";

const validPayload = {
  agree: true,
  name: "홍길동",
  studentId: "20240000",
  phone: "010-1234-5678",
  college: "정보과학대학",
  major: "IT융합전공",
  grade: "2학년 1학기",
  department: "frontend",
};

describe("stepOneSchema", () => {
  it("유효한 입력은 통과한다", () => {
    const result = stepOneSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("개인정보 동의를 하지 않으면 실패한다", () => {
    const result = stepOneSchema.safeParse({ ...validPayload, agree: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.agree?.[0]).toBe(
        "개인정보 수집 및 이용에 동의해주세요.",
      );
    }
  });

  describe("studentId", () => {
    it("8자리 숫자는 통과한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, studentId: "20240000" })
          .success,
      ).toBe(true);
    });

    it("7자리는 실패한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, studentId: "2024000" })
          .success,
      ).toBe(false);
    });

    it("9자리는 실패한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, studentId: "202400000" })
          .success,
      ).toBe(false);
    });

    it("숫자가 아닌 문자가 섞이면 실패한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, studentId: "2024000a" })
          .success,
      ).toBe(false);
    });
  });

  describe("phone", () => {
    it("010-1234-5678 형식은 통과한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, phone: "010-1234-5678" })
          .success,
      ).toBe(true);
    });

    it("중간 자리가 3자리여도 통과한다(정규식이 3~4자리를 허용)", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, phone: "010-123-5678" })
          .success,
      ).toBe(true);
    });

    it("대시가 없으면 실패한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, phone: "01012345678" })
          .success,
      ).toBe(false);
    });

    it("01x로 시작하지 않으면 실패한다", () => {
      expect(
        stepOneSchema.safeParse({ ...validPayload, phone: "02-1234-5678" })
          .success,
      ).toBe(false);
    });
  });

  describe("공백/빈 문자열 필드", () => {
    for (const key of ["name", "college", "major"] as const) {
      it(`${key}가 빈 문자열이면 실패한다`, () => {
        expect(
          stepOneSchema.safeParse({ ...validPayload, [key]: "" }).success,
        ).toBe(false);
      });

      it(`${key}가 공백만 있으면 실패한다`, () => {
        expect(
          stepOneSchema.safeParse({ ...validPayload, [key]: "   " }).success,
        ).toBe(false);
      });
    }

    it("name 앞뒤 공백은 trim되어 저장된다", () => {
      const result = stepOneSchema.safeParse({
        ...validPayload,
        name: " 홍길동 ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("홍길동");
      }
    });
  });

  it("grade가 빈 문자열이면 실패한다", () => {
    expect(
      stepOneSchema.safeParse({ ...validPayload, grade: "" }).success,
    ).toBe(false);
  });

  it("department가 빈 문자열이면 실패한다", () => {
    expect(
      stepOneSchema.safeParse({ ...validPayload, department: "" }).success,
    ).toBe(false);
  });
});
