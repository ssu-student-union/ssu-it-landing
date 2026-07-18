import type { ReactNode } from "react";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";

type TableCell = {
  id: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  "aria-label"?: string;
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
  variant?: "checkbox" | "radio";
  name?: string;
  className?: string;
};

// 두 테이블(고정 열/스크롤 열)의 행이 서로 어긋나지 않도록 모든 셀에
// 강제하는 공통 높이. td의 실제 컨텐츠(텍스트 한 줄 vs 체크박스)가 서로
// 달라 자연스러운 높이가 미묘하게 다를 수 있어서, 두 테이블 다 이 값으로
// 맞춰야 행끼리 정확히 나란해진다.
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
  const Field = variant === "radio" ? Radio : Checkbox;

  return (
    <div className={`flex ${className ?? ""}`}>
      <table className="shrink-0 border-separate border-spacing-y-3 sm:border-spacing-y-4">
        {columns && (
          <thead>
            <tr>
              <th className="p-0">
                <div
                  className={`flex ${HEADER_HEIGHT} items-center justify-center whitespace-nowrap px-2 font-medium text-black text-lg`}
                >
                  {cornerLabel}
                </div>
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="rounded-s-xl bg-[#f2f2f2] p-0">
                <div
                  className={`flex ${ROW_HEIGHT} items-center whitespace-nowrap px-4 font-medium text-base sm:text-lg`}
                >
                  {row.label}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="min-w-0 flex-1 overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3 sm:border-spacing-y-4">
          {columns && (
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column} className="p-0">
                    <div
                      className={`flex ${HEADER_HEIGHT} items-center justify-center whitespace-nowrap px-2 text-base text-[#5c5c5c] font-medium sm:text-lg`}
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
              <tr key={row.id} className="bg-[#f2f2f2]">
                {row.cells.map((cell, i) => (
                  <td
                    key={cell.id}
                    className={`p-0 ${
                      i === row.cells.length - 1 ? "rounded-e-xl" : ""
                    }`}
                  >
                    <div
                      className={`flex ${ROW_HEIGHT} items-center justify-center px-2`}
                    >
                      <Field
                        name={name}
                        checked={cell.checked}
                        disabled={cell.disabled}
                        error={error}
                        aria-label={cell["aria-label"]}
                        onChange={(e) => cell.onChange?.(e.target.checked)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
