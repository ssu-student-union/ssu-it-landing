import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "./constants";
import { stepThreeSchema } from "./schema";

describe("stepThreeSchema", () => {
  it("링크만 있으면 통과한다", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "https://example.com",
      portfolioFile: null,
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(true);
  });

  it("파일만 있으면 통과한다", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "",
      portfolioFile: { name: "portfolio.pdf", size: 1024 },
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(true);
  });

  it("링크와 파일이 둘 다 있으면 통과한다(OR이지 XOR이 아님)", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "https://example.com",
      portfolioFile: { name: "portfolio.pdf", size: 1024 },
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(true);
  });

  it("둘 다 비어있으면 portfolioLink 경로에만 issue가 붙는다(mirror 안 됨)", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "",
      portfolioFile: null,
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join("."));
      expect(paths).toContain("portfolioLink");
      expect(paths).not.toContain("portfolioFile");
      expect(result.error.issues).toHaveLength(1);
    }
  });

  it("공백만 있는 링크는 빈 값으로 취급되어, 파일도 없으면 실패한다", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "   ",
      portfolioFile: null,
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(false);
  });

  it("파일 크기가 제한을 초과하면 portfolioFile 경로에 별도 issue가 붙는다", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "https://example.com",
      portfolioFile: { name: "huge.pdf", size: MAX_FILE_SIZE + 1 },
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join("."));
      expect(paths).toContain("portfolioFile");
      expect(paths).not.toContain("portfolioLink");
    }
  });

  it("파일 크기가 제한 이하면 통과한다", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "",
      portfolioFile: { name: "ok.pdf", size: MAX_FILE_SIZE },
      activityCommitmentAck: true,
    });
    expect(result.success).toBe(true);
  });

  it("activityCommitmentAck를 체크하지 않으면 실패한다", () => {
    const result = stepThreeSchema.safeParse({
      portfolioLink: "https://example.com",
      portfolioFile: null,
      activityCommitmentAck: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join("."));
      expect(paths).toContain("activityCommitmentAck");
    }
  });
});
