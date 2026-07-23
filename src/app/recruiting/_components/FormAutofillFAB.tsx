"use client";

import Image from "next/image";
import autofillFabImage from "../../../assets/images/autofill_fab.webp";

type FormAutofillFABProps = {
  onAutofill: () => void;
};

export const FormAutofillFAB = ({ onAutofill }: FormAutofillFABProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 group sm:bottom-10 sm:right-10">
      {/* FAB Button */}
      <button
        type="button"
        onClick={onAutofill}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer overflow-hidden focus:outline-none"
      >
        <Image
          src={autofillFabImage}
          alt="Autofill"
          fill
          priority
          sizes="64px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>
    </div>
  );
};
