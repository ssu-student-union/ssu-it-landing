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
 * `error`와 글자수 초과를 합성해 보여주되, 글자수 초과만은 blur 게이팅 없이
 * 입력 즉시 표시한다 — 다른 칸으로 넘어가야 알 수 있으면 늦기 때문.
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
