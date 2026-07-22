import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fieldBorderClass } from "../ui/fieldState";
import { useFieldFocusState } from "./useFieldFocusState";

describe("useFieldFocusState", () => {
  it("터치 전에는 값/에러와 무관하게 default 스타일이고 에러도 안 보인다", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: "에러", hasValue: false }),
    );
    expect(result.current.fieldClassName).toContain(fieldBorderClass.default);
    expect(result.current.showError).toBe(false);
  });

  it("blur 후 에러가 있으면 error 스타일과 에러 표시를 보여준다", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: "에러", hasValue: false }),
    );
    act(() => result.current.handleBlur());
    expect(result.current.fieldClassName).toContain(fieldBorderClass.error);
    expect(result.current.showError).toBe(true);
  });

  it("터치했고 에러는 없지만 hasValue가 false면 selected가 아니라 default다 (회귀: 빈 필드 파란 테두리 버그)", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: undefined, hasValue: false }),
    );
    act(() => result.current.handleBlur());
    expect(result.current.fieldClassName).toContain(fieldBorderClass.default);
    expect(result.current.fieldClassName).not.toContain(
      fieldBorderClass.selected,
    );
  });

  it("터치했고 에러가 없고 hasValue가 true면 selected 스타일이다", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: undefined, hasValue: true }),
    );
    act(() => result.current.handleBlur());
    expect(result.current.fieldClassName).toContain(fieldBorderClass.selected);
  });

  it("bypassGate가 true면 터치 전에도 즉시 에러를 보여준다", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: "에러", hasValue: false, bypassGate: true }),
    );
    expect(result.current.showError).toBe(true);
  });

  it("submitted가 true면 blur 없이도 touched와 동일하게 취급된다", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: "에러", hasValue: false, submitted: true }),
    );
    expect(result.current.showError).toBe(true);
  });

  it("포커스 중에는 상태와 무관하게 border-black을 쓴다", () => {
    const { result } = renderHook(() =>
      useFieldFocusState({ error: "에러", hasValue: false, submitted: true }),
    );
    act(() => result.current.handleFocus());
    expect(result.current.fieldClassName).toContain("border-black");
  });
});
