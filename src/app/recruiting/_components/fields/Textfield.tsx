"use client";

import { useId } from "react";
import { useFieldFocusState } from "../../_lib/hooks";
import { maxLengthExceededMessage } from "../../_lib/schema";
import { FieldError } from "../question/FieldError";

type TextfieldProps = {
  label?: string;
  multiline?: boolean;
  maxLength?: number;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  submitted?: boolean;
  className?: string;
};

/**
 * `<input>`/`<textarea>`(`multiline`)를 하나로 다루는 텍스트 입력 필드.
 * `error`(페이지 스키마가 준 메시지)와 별개로 `maxLength`가 있으면 글자수를
 * 즉시 검사해 두 에러 소스를 합성한다. 일반 에러 문구는 blur 또는 폼
 * 제출(`submitted`) 중 먼저 오는 시점부터 보여주지만, 글자수 초과
 * (`isOverLimit`)만은 이 게이팅을 건너뛰고 입력하는 즉시(포커스 중이어도)
 * 카운터와 에러 문구가 함께 빨갛게 바뀐다 — "500자를 초과했어요"를 다른
 * 칸으로 넘어가야만 알 수 있으면 늦기 때문.
 */
export const Textfield = ({
  label,
  multiline = false,
  maxLength,
  rows = 6,
  value,
  onChange,
  placeholder,
  name,
  id,
  disabled,
  required,
  error,
  submitted = false,
  className,
}: TextfieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const overLimitMessage =
    maxLength !== undefined && value.length > maxLength
      ? maxLengthExceededMessage(maxLength)
      : undefined;
  const isOverLimit = overLimitMessage !== undefined;
  const errorMessage = error ?? overLimitMessage;

  const { showError, fieldClassName, handleFocus, handleBlur } =
    useFieldFocusState({
      submitted,
      error: errorMessage,
      bypassGate: isOverLimit,
    });

  const inputClassName = `${fieldClassName} placeholder:text-inactive`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block font-medium text-black text-lg"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${inputClassName} resize-none`}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClassName}
        />
      )}
      <div className="mt-1 flex items-center gap-2">
        <FieldError message={showError ? errorMessage : undefined} />
        {maxLength && (
          <span
            className={`ml-auto shrink-0 text-sm ${isOverLimit ? "text-red-500" : "text-muted"}`}
          >
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
