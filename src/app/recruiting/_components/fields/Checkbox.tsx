import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import checkIcon from "../../../../assets/icons/check.svg";
import { fieldBorderClass } from "../../_lib/ui";

type CheckboxProps = {
  label?: ReactNode;
  error?: boolean;
} & ComponentPropsWithoutRef<"input">;

export const Checkbox = ({
  label,
  error,
  className,
  id,
  disabled,
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  // disabled 셀은 애초에 고를 수 없는 시간이라, 에러(유효성) 표시가 뜨면 오히려 헷갈린다.
  const showError = error && !disabled;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2 select-none has-disabled:cursor-not-allowed has-disabled:opacity-35 ${className ?? ""}`}
    >
      <span
        className={`relative flex size-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors has-checked:border-brand has-checked:bg-brand has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-2 ${
          showError ? fieldBorderClass.error : fieldBorderClass.default
        }`}
      >
        <input
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className="peer absolute inset-0 cursor-pointer opacity-0"
          {...props}
        />
        <Image
          src={checkIcon}
          alt=""
          className="pointer-events-none size-4 scale-0 transition-transform peer-checked:scale-100"
        />
      </span>
      {label && <span className="text-ink text-lg">{label}</span>}
    </label>
  );
};
