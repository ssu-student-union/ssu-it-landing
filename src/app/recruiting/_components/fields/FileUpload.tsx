"use client";

import Image from "next/image";
import { useId } from "react";
import uploadIcon from "../../../../assets/icons/upload.svg";
import { fieldBorderClass } from "../../_lib/fieldState";

type FileUploadProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  error?: boolean;
};

export const FileUpload = ({
  file,
  onChange,
  accept,
  error,
}: FileUploadProps) => {
  const inputId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-5 py-4 text-black text-lg transition-colors ${
          error ? fieldBorderClass.error : fieldBorderClass.default
        }`}
      >
        <Image src={uploadIcon} alt="" className="size-7.75" />
        파일 업로드
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && (
        <div className="mt-3 flex items-center gap-3 text-base">
          <span className="text-black">{file.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[#5c5c5c] underline underline-offset-2 hover:text-black"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};
