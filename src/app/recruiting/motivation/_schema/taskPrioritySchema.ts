import { z } from "zod";
import type { FieldConfig } from "../../_lib/schema";

/** `taskPriorities` 폼 값의 형태: 과제(행 id) → 순위 슬롯("1"~"4"). */
export const taskPrioritiesShape = z.record(z.string(), z.string()).default({});

function taskPriorityFieldOf(fields: FieldConfig[]) {
  return fields.find(
    (field): field is Extract<FieldConfig, { type: "checkbox-matrix" }> =>
      field.type === "checkbox-matrix" && field.key === "taskPriorities",
  );
}

/** PM처럼 `taskPriorities` 문항이 있는 부서만 검증한다. 없는 부서는 그냥 통과. */
export function validateTaskPriorities(
  fields: FieldConfig[],
  data: { taskPriorities: Record<string, string> },
  ctx: z.RefinementCtx,
) {
  const field = taskPriorityFieldOf(fields);
  if (!field) return;

  const totalRows = field.groups.flatMap((group) => group.rows).length;
  const filledCount = Object.keys(data.taskPriorities ?? {}).length;

  if (filledCount < totalRows) {
    ctx.addIssue({
      path: ["taskPriorities"],
      code: z.ZodIssueCode.custom,
      message: "모든 과제에 순위를 매겨주세요.",
    });
  }
}
