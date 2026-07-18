"use client";

import { useId, useState } from "react";
import { fieldBorderClass } from "../../_lib/fieldState";
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
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const isTouched = touched || submitted;

  const state = !isTouched ? "default" : error ? "error" : "selected";
  const showError = isTouched && !focused && Boolean(error);

  const borderClassName = focused ? "border-black" : fieldBorderClass[state];
  const fieldClassName = `w-full border-b-2 bg-transparent py-2 text-black text-lg outline-none transition-colors ${borderClassName}`;

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
      <input
        id={inputId}
        name={name}
        type="datetime-local"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setTouched(true);
        }}
        className={fieldClassName}
      />
      <div className="mt-1">
        <FieldError message={showError ? error : undefined} />
      </div>
    </div>
  );
};
