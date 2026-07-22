"use client";

import { useId } from "react";
import { useFieldFocusState } from "../../_lib/hooks";
import { FieldError } from "../question/FieldError";

type DateTimePickerProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  name?: string;
  id?: string;
  error?: string;
  submitted?: boolean;
  className?: string;
};

export const DateTimePicker = ({
  label,
  value,
  onChange,
  min,
  max,
  name,
  id,
  error,
  submitted = false,
  className,
}: DateTimePickerProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const { showError, fieldClassName, handleFocus, handleBlur } =
    useFieldFocusState({ submitted, error, hasValue: value.length > 0 });

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
      <input
        id={inputId}
        name={name}
        type="datetime-local"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={fieldClassName}
      />
      <div className="mt-1">
        <FieldError message={showError ? error : undefined} />
      </div>
    </div>
  );
};
