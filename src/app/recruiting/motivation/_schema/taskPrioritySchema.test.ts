import { describe, expect, it } from "vitest";
import type { FieldConfig } from "../../_lib/schema";
import { validateTaskPriorities } from "./taskPrioritySchema";
import { collectIssues } from "./testHelpers";

const pmFields: FieldConfig[] = [
  {
    type: "checkbox-matrix",
    key: "taskPriorities",
    groups: [
      {
        columns: ["1순위", "2순위"],
        rows: [
          { id: "student-council-site", label: "총학생회 홈페이지" },
          { id: "club-council-site", label: "동아리연합회 홈페이지" },
        ],
        slots: ["1", "2"],
      },
      {
        columns: ["3순위", "4순위"],
        rows: [
          { id: "ssuport", label: "SSUport (특별장학금)" },
          { id: "etc", label: "기타" },
        ],
        slots: ["3", "4"],
      },
    ],
    getChecked: () => false,
    onToggle: (values) => values,
  },
];

const nonPmFields: FieldConfig[] = [{ type: "text", key: "motivation" }];

describe("validateTaskPriorities", () => {
  it("taskPriorities 문항이 없는 부서는 검증을 건너뛴다", () => {
    const issues = collectIssues((ctx) =>
      validateTaskPriorities(nonPmFields, { taskPriorities: {} }, ctx),
    );
    expect(issues).toHaveLength(0);
  });

  it("4개 과제에 모두 순위를 매기면 통과한다", () => {
    const issues = collectIssues((ctx) =>
      validateTaskPriorities(
        pmFields,
        {
          taskPriorities: {
            "student-council-site": "1",
            "club-council-site": "2",
            ssuport: "3",
            etc: "4",
          },
        },
        ctx,
      ),
    );
    expect(issues).toHaveLength(0);
  });

  it("일부만 순위를 매기면 issue를 추가한다", () => {
    const issues = collectIssues((ctx) =>
      validateTaskPriorities(
        pmFields,
        { taskPriorities: { "student-council-site": "1" } },
        ctx,
      ),
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toEqual(["taskPriorities"]);
  });

  it("아무것도 선택하지 않으면 issue를 추가한다", () => {
    const issues = collectIssues((ctx) =>
      validateTaskPriorities(pmFields, { taskPriorities: {} }, ctx),
    );
    expect(issues).toHaveLength(1);
  });
});
