"use client";

import { useState } from "react";
import { fieldBorderClass } from "../ui/fieldState";

type UseFieldFocusStateOptions = {
  submitted?: boolean;
  /** 표시할 최종 에러 메시지(호출부에서 이미 합성된 값). */
  error?: string;
  /** true면 blur 게이팅을 건너뛰고 즉시 에러로 표시한다(예: 글자수 초과). */
  bypassGate?: boolean;
};

/** `Textfield`·`DateTimePicker`가 공유하는 focus/blur 상태 훅. 에러는 blur 또는 제출 시점부터 보이되, `bypassGate`가 켜지면 포커스 중에도 즉시 표시한다. */
export function useFieldFocusState({
  submitted = false,
  error,
  bypassGate = false,
}: UseFieldFocusStateOptions) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const isTouched = touched || submitted;

  const state = !isTouched ? "default" : error ? "error" : "selected";
  const showError = Boolean(error) && (bypassGate || (isTouched && !focused));

  const borderClassName = bypassGate
    ? fieldBorderClass.error
    : focused
      ? "border-black"
      : fieldBorderClass[state];
  const fieldClassName = `w-full border-b-2 bg-transparent py-2 text-black text-lg outline-none transition-colors ${borderClassName}`;

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
  };

  return { showError, fieldClassName, handleFocus, handleBlur };
}
