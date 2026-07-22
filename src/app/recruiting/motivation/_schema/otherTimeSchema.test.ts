import { describe, expect, it } from "vitest";
import { validateOtherTime } from "./otherTimeSchema";
import { collectIssues } from "./testHelpers";

describe("validateOtherTime", () => {
  it("noAvailableTime이 false면 검증을 건너뛴다", () => {
    const issues = collectIssues((ctx) =>
      validateOtherTime({ otherTime: [], noAvailableTime: false }, ctx),
    );
    expect(issues).toHaveLength(0);
  });

  it("noAvailableTime이 true인데 채운 구간이 없으면 issue를 추가한다", () => {
    const issues = collectIssues((ctx) =>
      validateOtherTime(
        { otherTime: [{ start: "", end: "" }], noAvailableTime: true },
        ctx,
      ),
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toEqual(["otherTime"]);
  });

  it("시작 시각이 종료 시각보다 늦으면 issue를 추가한다", () => {
    const issues = collectIssues((ctx) =>
      validateOtherTime(
        {
          otherTime: [{ start: "2026-08-01T20:00", end: "2026-08-01T19:00" }],
          noAvailableTime: true,
        },
        ctx,
      ),
    );
    expect(issues).toHaveLength(1);
  });

  it("시작 시각과 종료 시각이 같아도 issue를 추가한다(isSameOrAfter)", () => {
    const issues = collectIssues((ctx) =>
      validateOtherTime(
        {
          otherTime: [{ start: "2026-08-01T19:00", end: "2026-08-01T19:00" }],
          noAvailableTime: true,
        },
        ctx,
      ),
    );
    expect(issues).toHaveLength(1);
  });

  it("유효한 시작<종료 구간이 있으면 통과한다", () => {
    const issues = collectIssues((ctx) =>
      validateOtherTime(
        {
          otherTime: [{ start: "2026-08-01T19:00", end: "2026-08-01T20:00" }],
          noAvailableTime: true,
        },
        ctx,
      ),
    );
    expect(issues).toHaveLength(0);
  });
});
