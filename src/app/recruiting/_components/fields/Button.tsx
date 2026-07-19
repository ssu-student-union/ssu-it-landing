import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import arrowIcon from "../../../../assets/icons/arrow.svg";

type ButtonProps = {
  icon?: "prev" | "next";
} & ComponentPropsWithoutRef<"button">;

export const Button = ({
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-0.5 whitespace-nowrap rounded-xl bg-brand px-5 py-3 text-[1.875rem] text-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active ${
        icon ? "font-medium" : "font-semibold"
      } ${className ?? ""}`}
      {...props}
    >
      {icon === "prev" && (
        <Image src={arrowIcon} alt="" className="size-10 rotate-180" />
      )}
      {children}
      {icon === "next" && <Image src={arrowIcon} alt="" className="size-10" />}
    </button>
  );
};
