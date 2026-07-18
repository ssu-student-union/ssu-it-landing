"use client";

import { useId, useState } from "react";
import { z } from "zod";
import { fieldBorderClass } from "../../_lib/fieldState";
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
 * `error`(페이지 스키마가 준 메시지)와 별개로 `maxLength`가 있으면 내부
 * zod로 글자수를 즉시 검증해 두 에러 소스를 합성한다. 일반 에러 문구는
 * blur 또는 폼 제출(`submitted`) 중 먼저 오는 시점부터 보여주지만
 * (`isTouched`), 글자수 초과(`isOverLimit`)만은 이 게이팅을 건너뛰고
 * 입력하는 즉시(포커스 중이어도) 카운터와 에러 문구가 함께 빨갛게 바뀐다 —
 * "500자를 초과했어요"를 다른 칸으로 넘어가야만 알 수 있으면 늦기 때문.
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
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const isTouched = touched || submitted;

  const schema = maxLength
    ? z.string().max(maxLength, `${maxLength}자를 초과했어요.`)
    : z.string();
  const result = schema.safeParse(value);
  const errorMessage =
    error ?? (result.success ? undefined : result.error.issues[0]?.message);

  const isOverLimit = maxLength !== undefined && value.length > maxLength;
  const state = !isTouched ? "default" : errorMessage ? "error" : "selected";
  const showError =
    Boolean(errorMessage) && (isOverLimit || (isTouched && !focused));

  const borderClassName = isOverLimit
    ? fieldBorderClass.error
    : focused
      ? "border-black"
      : fieldBorderClass[state];

  const fieldClassName = `w-full border-b-2 bg-transparent py-2 text-black text-lg outline-none transition-colors placeholder:text-[#c2c2c2] ${borderClassName}`;

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
  };

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
          className={`${fieldClassName} resize-none`}
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
          className={fieldClassName}
        />
      )}
      <div className="mt-1 flex items-center gap-2">
        <FieldError message={showError ? errorMessage : undefined} />
        {maxLength && (
          <span
            className={`ml-auto shrink-0 text-sm ${isOverLimit ? "text-red-500" : "text-[#5c5c5c]"}`}
          >
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
