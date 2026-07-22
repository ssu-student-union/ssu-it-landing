"use client";

import { useEffect, useState } from "react";
import type { z } from "zod";
import { scrollToElementCentered } from "../ui";

/** sessionStorage에서 저장된 값을 읽어온다(없거나 파싱 실패 시 `initialValues`로 폴백). */
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

/** `values`와 별도 키에 저장되는 `submitted` 플래그. 같은 이유로 미러링한다 — "이전" 이동 시 리마운트돼도 이미 봤던 검증 에러 표시가 사라지지 않게. */
const submittedStorageKey = (storageKey: string) => `${storageKey}:submitted`;

function readStoredSubmitted(storageKey: string | undefined): boolean {
  if (!storageKey || typeof window === "undefined") return false;
  return (
    window.sessionStorage.getItem(submittedStorageKey(storageKey)) === "true"
  );
}

/**
 * 리크루팅 폼 3단계가 공유하는 상태/검증 훅.
 * `schemaFactory`가 함수인 이유: Step2는 선택된 부서에 따라 검증 규칙이
 * 달라져 훅 호출 시점엔 최신 `values`를 모른다. `storageKey`를 넘기면
 * `values`를 sessionStorage에 미러링해 "이전" 이동 시 리마운트돼도 값을 지킨다.
 * 실패 시 zod `fieldErrors`의 첫 번째 키로 `field-${key}` 엘리먼트를 찾아
 * 스크롤하므로, 각 페이지의 문항 순서는 스키마 필드 선언 순서와 같아야 한다.
 */
export function useFormState<T extends Record<string, unknown>>(
  schemaFactory: (values: T) => z.ZodType<T, unknown>,
  initialValues: T,
  storageKey?: string,
) {
  // 초기값은 서버·클라이언트가 동일해야 하므로 sessionStorage는 마운트 후에
  // 읽는다(초기 렌더에서 읽으면 하이드레이션 불일치가 난다). 복원 전에는
  // write-back으로 저장값을 덮어쓰지 않도록 `hydrated`로 가드한다.
  const [values, setValues] = useState<T>(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 복원한다
  useEffect(() => {
    setValues(readStoredValues(storageKey, initialValues));
    setSubmitted(readStoredSubmitted(storageKey));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!storageKey || !hydrated) return;
    window.sessionStorage.setItem(storageKey, JSON.stringify(values));
  }, [values, storageKey, hydrated]);

  useEffect(() => {
    if (!storageKey || !hydrated) return;
    window.sessionStorage.setItem(
      submittedStorageKey(storageKey),
      String(submitted),
    );
  }, [submitted, storageKey, hydrated]);

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
