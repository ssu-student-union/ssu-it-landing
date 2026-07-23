"use client";

import { useId, useState } from "react";
import { useFieldFocusState } from "../../_lib/hooks";
import { maxLengthExceededMessage, REQUIRED_MESSAGE } from "../../_lib/schema";
import { FieldError } from "../question/FieldError";

type TextfieldProps = {
  label?: string;
  multiline?: boolean;
  /** 단일 행(`multiline`이 아닐 때)의 `<input type>`. 기본값 "text". */
  type?: "text" | "email";
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
 * `error`와 글자수 초과/필수값 미입력을 합성해 보여주되, 이 둘만은 blur
 * 게이팅 없이 입력 즉시 표시한다 — 다른 칸으로 넘어가야 알 수 있으면 늦기
 * 때문. 다만 아직 한 번도 입력하지 않은 textarea를 열자마자 에러로 보이면
 * 안 되므로, 0자 체크는 한 번이라도 타이핑한 뒤(`hasTyped`)에만 즉시
 * 표시한다.
 */
export const Textfield = ({
  label,
  multiline = false,
  type = "text",
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
  const [hasTyped, setHasTyped] = useState(false);

  const overLimitMessage =
    maxLength !== undefined && value.length > maxLength
      ? maxLengthExceededMessage(maxLength)
      : undefined;
  const isOverLimit = overLimitMessage !== undefined;

  const isEmptyRequired =
    multiline && (required ?? true) && hasTyped && value.trim().length === 0;

  const errorMessage =
    error ??
    overLimitMessage ??
    (isEmptyRequired ? REQUIRED_MESSAGE : undefined);

  const { showError, fieldClassName, handleFocus, handleBlur } =
    useFieldFocusState({
      submitted,
      error: errorMessage,
      bypassGate: isOverLimit || isEmptyRequired,
      hasValue: value.trim().length > 0,
    });

  const inputClassName = `${fieldClassName} placeholder:text-inactive`;

  const handleChange = (next: string) => {
    if (!hasTyped) setHasTyped(true);
    onChange(next);
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block font-medium text-ink text-lg"
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
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${inputClassName} resize-none`}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
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
