import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { fieldBorderClass } from "../../_lib/ui";

type RadioProps = {
  label?: ReactNode;
  error?: boolean;
} & ComponentPropsWithoutRef<"input">;

export const Radio = ({
  label,
  error,
  className,
  id,
  disabled,
  ...props
}: RadioProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  // disabled 옵션은 애초에 고를 수 없으니 에러(유효성) 표시를 띄우지 않는다.
  const showError = error && !disabled;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2 select-none has-disabled:cursor-not-allowed has-disabled:opacity-35 ${className ?? ""}`}
    >
      <span
        className={`relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors has-checked:border-brand has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-2 ${
          showError ? fieldBorderClass.error : fieldBorderClass.default
        }`}
      >
        <input
          id={inputId}
          type="radio"
          disabled={disabled}
          className="peer absolute inset-0 cursor-pointer opacity-0"
          {...props}
        />
        <span className="pointer-events-none size-3.5 scale-0 rounded-full bg-brand transition-transform peer-checked:scale-100" />
      </span>
      {label && <span className="text-ink text-lg">{label}</span>}
    </label>
  );
};
