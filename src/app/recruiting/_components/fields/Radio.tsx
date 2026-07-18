import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { fieldBorderClass } from "../../_lib/fieldState";

type RadioProps = {
  label?: ReactNode;
  error?: boolean;
} & ComponentPropsWithoutRef<"input">;

export const Radio = ({
  label,
  error,
  className,
  id,
  ...props
}: RadioProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2 select-none has-disabled:cursor-not-allowed has-disabled:opacity-50 ${className ?? ""}`}
    >
      <span
        className={`relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors has-checked:border-[#142992] has-focus-visible:ring-2 has-focus-visible:ring-[#142992] has-focus-visible:ring-offset-2 ${
          error ? fieldBorderClass.error : fieldBorderClass.default
        }`}
      >
        <input
          id={inputId}
          type="radio"
          className="peer absolute inset-0 cursor-pointer opacity-0"
          {...props}
        />
        <span className="pointer-events-none size-3.5 scale-0 rounded-full bg-[#142992] transition-transform peer-checked:scale-100" />
      </span>
      {label && <span className="text-black text-lg">{label}</span>}
    </label>
  );
};
