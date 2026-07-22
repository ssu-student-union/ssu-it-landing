import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { useFormState } from "./useFormState";

type Values = { name: string };

const schema = () =>
  z.object({ name: z.string().min(1, "이름을 입력해주세요.") });

const initialValues: Values = { name: "" };

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  window.sessionStorage.clear();
});

describe("useFormState", () => {
  it("storageKey가 없으면 initialValues로 시작하고 submitted는 false다", () => {
    const { result } = renderHook(() => useFormState(schema, initialValues));
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.submitted).toBe(false);
  });

  it("sessionStorage에 저장된 값이 있으면 마운트 후 복원한다", () => {
    window.sessionStorage.setItem(
      "step-test",
      JSON.stringify({ name: "홍길동" }),
    );
    const { result } = renderHook(() =>
      useFormState(schema, initialValues, "step-test"),
    );
    expect(result.current.values.name).toBe("홍길동");
  });

  it("이전에 저장된 submitted 흔적이 있어도 마운트 시에는 항상 false로 시작한다(회귀: 폼 재진입 시 전부 에러로 뜨던 문제)", () => {
    window.sessionStorage.setItem("step-test:submitted", "true");
    const { result } = renderHook(() =>
      useFormState(schema, initialValues, "step-test"),
    );
    expect(result.current.submitted).toBe(false);
  });

  it("setField로 값을 바꾸면 sessionStorage에 미러링된다", () => {
    const { result } = renderHook(() =>
      useFormState(schema, initialValues, "step-test"),
    );
    act(() => result.current.setField("name", "새 이름"));
    expect(
      JSON.parse(window.sessionStorage.getItem("step-test") ?? "{}"),
    ).toEqual({ name: "새 이름" });
  });

  it("validate()는 submitted를 true로 바꾸고 safeParse 결과를 반환한다", () => {
    const { result } = renderHook(() => useFormState(schema, initialValues));
    let validation: ReturnType<typeof result.current.validate> | undefined;
    act(() => {
      validation = result.current.validate();
    });
    expect(result.current.submitted).toBe(true);
    expect(validation?.success).toBe(false);
  });

  it("submitted가 true일 때 validate()가 성공하면 success: true를 반환한다", () => {
    const { result } = renderHook(() =>
      useFormState(schema, { name: "홍길동" }),
    );
    let validation: ReturnType<typeof result.current.validate> | undefined;
    act(() => {
      validation = result.current.validate();
    });
    expect(validation?.success).toBe(true);
  });

  it("fieldError는 submitted 이전에는 항상 undefined다", () => {
    const { result } = renderHook(() => useFormState(schema, initialValues));
    expect(result.current.fieldError("name")).toBeUndefined();
  });

  it("submitted 이후에는 실제 에러 메시지를 반환한다", () => {
    const { result } = renderHook(() => useFormState(schema, initialValues));
    act(() => result.current.validate());
    expect(result.current.fieldError("name")).toBe("이름을 입력해주세요.");
  });
});
