import { describe, expect, it } from "vitest";
import type { FieldConfig } from "../../_lib/schema";
import { fieldSchemaEntry } from "./fieldSchema";

describe("fieldSchemaEntry", () => {
  it("checkbox-group은 최소 1개 선택을 요구하는 배열 스키마를 만든다", () => {
    const field: FieldConfig = {
      type: "checkbox-group",
      key: "tasks",
      options: ["a", "b"],
    };
    const entry = fieldSchemaEntry(field);
    expect(entry?.[0]).toBe("tasks");
    expect(entry?.[1].safeParse([]).success).toBe(false);
    expect(entry?.[1].safeParse(["a"]).success).toBe(true);
  });

  it("text/textarea는 빈 문자열을 거부하는 문자열 스키마를 만든다", () => {
    const field: FieldConfig = { type: "text", key: "motivation" };
    const entry = fieldSchemaEntry(field);
    expect(entry?.[1].safeParse("").success).toBe(false);
    expect(entry?.[1].safeParse("좋은 이유").success).toBe(true);
  });

  it("maxLength가 있으면 초과 시 실패한다", () => {
    const field: FieldConfig = {
      type: "textarea",
      key: "fitReason",
      maxLength: 5,
    };
    const entry = fieldSchemaEntry(field);
    expect(entry?.[1].safeParse("123456").success).toBe(false);
    expect(entry?.[1].safeParse("12345").success).toBe(true);
  });

  it("checkbox-matrix 등 다른 타입은 undefined를 반환한다", () => {
    const field: FieldConfig = {
      type: "checkbox-matrix",
      key: "interviewAvailability",
      groups: [],
      getChecked: () => false,
      onToggle: (values) => values,
    };
    expect(fieldSchemaEntry(field)).toBeUndefined();
  });
});
