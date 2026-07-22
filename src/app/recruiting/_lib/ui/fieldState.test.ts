import { describe, expect, it } from "vitest";
import { fieldBorderClass } from "./fieldState";

describe("fieldBorderClass", () => {
  it("default/selected/error 세 가지 상태 클래스를 모두 가진다", () => {
    expect(fieldBorderClass.default).toBe("border-line");
    expect(fieldBorderClass.selected).toBe("border-brand");
    expect(fieldBorderClass.error).toBe("border-red-500");
  });
});
