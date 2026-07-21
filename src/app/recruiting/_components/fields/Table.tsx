import type { ReactNode } from "react";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";

type TableCell = {
  id: string;
  // 체크박스/라디오 모드
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  "aria-label"?: string;
  // 텍스트 모드(variant="text")에서 셀에 표시할 내용
  content?: ReactNode;
};

type TableRow = {
  id: string;
  label: ReactNode;
  cells: TableCell[];
};

type TableProps = {
  cornerLabel?: ReactNode;
  columns?: string[];
  rows: TableRow[];
  error?: boolean;
  /** "checkbox"·"radio"=입력 셀, "text"=읽기 전용 텍스트 셀. */
  variant?: "checkbox" | "radio" | "text";
  name?: string;
  className?: string;
};

const ROW_HEIGHT = "h-14";
const HEADER_HEIGHT = "h-10";

export const Table = ({
  cornerLabel,
  columns,
  rows,
  error,
  variant = "checkbox",
  name,
  className,
}: TableProps) => {
  const isText = variant === "text";
  const Field = variant === "radio" ? Radio : Checkbox;

  return (
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <table className="w-full border-separate border-spacing-y-3 sm:border-spacing-y-4">
        {columns && (
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-canvas p-0">
                <div
                  className={`flex ${HEADER_HEIGHT} items-center whitespace-nowrap font-medium text-ink text-lg ${
                    isText ? "justify-start px-4" : "justify-center px-2"
                  }`}
                >
                  {cornerLabel}
                </div>
              </th>
              {columns.map((column) => (
                <th key={column} className="p-0">
                  <div
                    className={`flex ${HEADER_HEIGHT} items-center whitespace-nowrap font-medium text-base text-muted sm:text-lg ${
                      isText ? "justify-start px-4" : "justify-center px-2"
                    }`}
                  >
                    {column}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="sticky left-0 z-10 rounded-s-xl bg-surface p-0">
                <div
                  className={`flex ${ROW_HEIGHT} items-center whitespace-nowrap px-4 font-medium text-base text-ink sm:text-lg`}
                >
                  {row.label}
                </div>
              </td>
              {row.cells.map((cell, i) => (
                <td
                  key={cell.id}
                  className={`bg-surface p-0 ${
                    i === row.cells.length - 1 ? "rounded-e-xl" : ""
                  }`}
                >
                  <div
                    className={`flex ${ROW_HEIGHT} items-center ${
                      isText
                        ? "px-4 font-medium text-base text-ink sm:text-lg"
                        : "justify-center px-2"
                    }`}
                  >
                    {isText ? (
                      cell.content
                    ) : (
                      <Field
                        name={name}
                        checked={cell.checked}
                        disabled={cell.disabled}
                        error={error}
                        aria-label={cell["aria-label"]}
                        onChange={(e) => cell.onChange?.(e.target.checked)}
                      />
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
