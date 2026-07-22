import type { z } from "zod";

/** `ctx.addIssue`를 호출하는 검증기 함수를 목업 `RefinementCtx`로 실행해, 발생한 issue만 모아온다. */
export function collectIssues(
  run: (ctx: z.RefinementCtx) => void,
): { path: PropertyKey[]; message?: string }[] {
  const issues: { path: PropertyKey[]; message?: string }[] = [];
  const ctx: z.RefinementCtx = {
    value: undefined,
    issues: [],
    addIssue: (issue) => {
      if (typeof issue === "string") {
        issues.push({ path: [], message: issue });
        return;
      }
      issues.push({ path: issue.path ?? [], message: issue.message });
    },
  };
  run(ctx);
  return issues;
}
