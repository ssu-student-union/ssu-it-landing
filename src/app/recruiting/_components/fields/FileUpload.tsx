"use client";

import Image from "next/image";
import { useId } from "react";
import uploadIcon from "../../../../assets/icons/upload.svg";
import { fieldBorderClass, formatFileSize } from "../../_lib/ui";

/** 모바일에서는 축소된 크기로 시작해 `sm`부터 기존(데스크톱) 디자인 크기로 맞춘다. */
const RESPONSIVE_CONTROL_CLASSES =
  "gap-2 px-4 py-3 text-base sm:gap-2.5 sm:px-5 sm:py-4 sm:text-lg";
const RESPONSIVE_ICON_CLASSES = "size-6 sm:size-7.75";

type FileUploadProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  error?: boolean;
};

export const FileUpload = ({
  file,
  onChange,
  accept,
  maxSize,
  error,
}: FileUploadProps) => {
  const inputId = useId();
  const isOverSize = Boolean(
    file && maxSize !== undefined && file.size > maxSize,
  );
  const borderClassName = error
    ? fieldBorderClass.error
    : file
      ? fieldBorderClass.selected
      : fieldBorderClass.default;

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`inline-flex cursor-pointer items-center rounded-xl border text-ink transition-colors ${RESPONSIVE_CONTROL_CLASSES} ${borderClassName}`}
      >
        <Image src={uploadIcon} alt="" className={RESPONSIVE_ICON_CLASSES} />
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
          <span className="text-ink">{file.name}</span>
          {maxSize !== undefined && (
            <span
              className={`text-sm ${isOverSize ? "text-red-500" : "text-muted"}`}
            >
              {formatFileSize(file.size)} / {formatFileSize(maxSize)}
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-muted underline underline-offset-2 hover:text-ink"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};
