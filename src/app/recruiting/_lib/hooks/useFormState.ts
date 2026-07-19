"use client";

import { useEffect, useState } from "react";
import type { z } from "zod";
import { scrollToElementCentered } from "../ui";

/** `storageKey`가 주어졌을 때 sessionStorage에서 이전에 저장된 값을 동기적으로 읽어온다(SSR/파싱 실패 시 `initialValues`로 폴백). */
function readStoredValues<T>(
  storageKey: string | undefined,
  initialValues: T,
): T {
  if (!storageKey || typeof window === "undefined") return initialValues;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    return raw ? { ...initialValues, ...JSON.parse(raw) } : initialValues;
  } catch {
    return initialValues;
  }
}

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
 *
 * `storageKey`를 넘기면 `values`를 sessionStorage에 미러링한다 — 각 스텝이
 * 별개의 라우트/페이지 컴포넌트라 "이전" 버튼으로 이동하면 컴포넌트가
 * 완전히 리마운트되어 로컬 `useState`만으로는 입력값이 사라지기 때문이다.
 */
export function useFormState<T extends Record<string, unknown>>(
  schemaFactory: (values: T) => z.ZodType<T, unknown>,
  initialValues: T,
  storageKey?: string,
) {
  const [values, setValues] = useState<T>(() =>
    readStoredValues(storageKey, initialValues),
  );
  const [submitted, setSubmitted] = useState(false);

  // 값이 바뀔 때마다 세션 스토리지에 저장
  useEffect(() => {
    if (!storageKey) return;
    window.sessionStorage.setItem(storageKey, JSON.stringify(values));
  }, [values, storageKey]);

  // 값 변경 헬퍼 함수
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

  // 실시간 검증: `errors`는 `values`가 바뀔 때마다 갱신되지만, `fieldError`는
  // `submitted`가 true일 때만 에러 메시지를 반환한다. 즉, 사용자가 입력을
  // 시작하면 에러 메시지가 바로 뜨지 않고, "제출" 버튼을 눌러야 에러가
  // 표시된다.
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
