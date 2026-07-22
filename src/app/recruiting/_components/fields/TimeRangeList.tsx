"use client";

import Image from "next/image";
import plusIcon from "../../../../assets/icons/plus_thin.svg";
import { dayjs } from "../../../../lib";
import { TIME_RANGE_ORDER_MESSAGE } from "../../_lib/schema";
import { fieldBorderClass } from "../../_lib/ui";
import { FieldError } from "../question/FieldError";
import { DateTimePicker } from "./DateTimePicker";

export type TimeRange = { start: string; end: string };

type TimeRangeListProps = {
  value: TimeRange[];
  onChange: (value: TimeRange[]) => void;
  min?: string;
  max?: string;
  error?: string;
  submitted?: boolean;
};

/** (시작~종료) 시간 범위 반복 필드. `value`가 빈 배열이면 빈 입력 행 하나를 시각적으로만 보여준다(빈 배열 ↔ 빈 행 1개를 동일하게 취급). */
export const TimeRangeList = ({
  value,
  onChange,
  min,
  max,
  error,
  submitted,
}: TimeRangeListProps) => {
  const ranges = value.length > 0 ? value : [{ start: "", end: "" }];

  const updateRange = (index: number, patch: Partial<TimeRange>) => {
    onChange(ranges.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addRange = () => onChange([...ranges, { start: "", end: "" }]);
  const removeRange = (index: number) =>
    onChange(ranges.filter((_, i) => i !== index));

  const rangeError = (range: TimeRange) =>
    submitted &&
    range.start &&
    range.end &&
    dayjs(range.start).isSameOrAfter(dayjs(range.end))
      ? TIME_RANGE_ORDER_MESSAGE
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      {ranges.map((range, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 행은 끝에 추가되고 임의 위치에서 삭제되지만, 각 DateTimePicker는 완전히 controlled라 순서만 안 바뀌면 인덱스 키로 충분하다.
        <div key={index} className="flex flex-wrap items-end gap-3">
          <DateTimePicker
            label="시작"
            value={range.start}
            onChange={(v) => updateRange(index, { start: v })}
            min={min}
            max={max}
            submitted={submitted}
            className="min-w-55 flex-1"
          />
          <DateTimePicker
            label="종료"
            value={range.end}
            onChange={(v) => updateRange(index, { end: v })}
            min={min}
            max={max}
            error={rangeError(range)}
            submitted={submitted}
            className="min-w-55 flex-1"
          />
          {ranges.length > 1 && (
            <button
              type="button"
              onClick={() => removeRange(index)}
              className="mb-2 shrink-0 text-muted text-sm underline underline-offset-2 hover:text-ink"
            >
              삭제
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addRange}
        className={`inline-flex w-fit items-center gap-2.5 rounded-xl border px-5 py-4 text-ink text-lg transition-colors ${fieldBorderClass.default}`}
      >
        <Image src={plusIcon} alt="" className="size-7.75" />
        시간 추가
      </button>
      <FieldError message={submitted ? error : undefined} />
    </div>
  );
};
