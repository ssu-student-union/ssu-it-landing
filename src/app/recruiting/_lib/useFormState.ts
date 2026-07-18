"use client";

import { useState } from "react";
import type { z } from "zod";
import { scrollToElementCentered } from "./scrollToElement";

/**
 * 리크루팅 폼 3단계가 공유하는 상태/검증 훅.
 *
 * `schemaFactory`가 스키마 인스턴스가 아니라 `(values) => 스키마` 함수인
 * 이유: Step2처럼 선택된 부서에 따라 검증 규칙 자체가 달라지는 폼은,
 * 훅을 호출하는 시점엔 아직 최신 `values`를 모르기 때문에 고정 스키마를
 * 미리 넘길 수 없다. 스키마가 고정인 Step1/Step3는 그냥
 * `() => staticSchema`처럼 항상 같은 스키마를 반환하는 팩토리를 넘기면 된다.
 *
 * 실패 시 `document.getElementById(\`field-${첫 에러 키}\`)`로 스크롤한다
 * (`scrollToElementCentered`). 이 키는 zod `fieldErrors`의 첫 번째 키,
 * 즉 스키마에 필드를 선언한 순서와 같다 — 그래서 각 페이지의 문항 순서와
 * 스키마 필드 선언 순서를 맞춰둬야 "가장 위에 있는 에러"로 정확히 스크롤된다.
 */
export function useFormState<T extends Record<string, unknown>>(
  schemaFactory: (values: T) => z.ZodType<T, unknown>,
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof T>(
    key: K,
    next: T[K] | ((prev: T[K]) => T[K]),
  ) =>
    setValues((prev) => ({
      ...prev,
      [key]:
        typeof next === "function"
          ? (next as (p: T[K]) => T[K])(prev[key])
          : next,
    }));

  const schema = schemaFactory(values);
  const result = schema.safeParse(values);
  const errors: Partial<Record<keyof T, string[]>> = result.success
    ? {}
    : result.error.flatten().fieldErrors;

  const validate = () => {
    setSubmitted(true);
    const result = schemaFactory(values).safeParse(values);
    if (!result.success) {
      const firstKey = Object.keys(result.error.flatten().fieldErrors)[0];
      if (firstKey) {
        requestAnimationFrame(() => {
          const el = document.getElementById(`field-${firstKey}`);
          if (el) scrollToElementCentered(el);
        });
      }
    }
    return result;
  };

  const fieldError = (key: keyof T) =>
    submitted ? errors[key]?.[0] : undefined;

  return {
    values,
    setField,
    setValues,
    errors,
    submitted,
    validate,
    fieldError,
  };
}
