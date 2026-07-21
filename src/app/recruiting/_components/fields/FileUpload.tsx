"use client";

import Image from "next/image";
import { useId } from "react";
import uploadIcon from "../../../../assets/icons/upload.svg";
import { fieldBorderClass, formatFileSize } from "../../_lib/ui";

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

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-5 py-4 text-ink text-lg transition-colors ${
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
