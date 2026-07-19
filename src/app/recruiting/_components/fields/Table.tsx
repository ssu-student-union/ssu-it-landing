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
    <div className={`overflow-x-auto ${className ?? ""}`}>
      <table className="w-full border-separate border-spacing-y-3 sm:border-spacing-y-4">
        {columns && (
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-canvas p-0">
                <div
                  className={`flex ${HEADER_HEIGHT} items-center justify-center whitespace-nowrap px-2 font-medium text-black text-lg`}
                >
                  {cornerLabel}
                </div>
              </th>
              {columns.map((column) => (
                <th key={column} className="p-0">
                  <div
                    className={`flex ${HEADER_HEIGHT} items-center justify-center whitespace-nowrap px-2 text-base text-muted font-medium sm:text-lg`}
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
                  className={`flex ${ROW_HEIGHT} items-center whitespace-nowrap px-4 font-medium text-base sm:text-lg`}
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
  );
};
