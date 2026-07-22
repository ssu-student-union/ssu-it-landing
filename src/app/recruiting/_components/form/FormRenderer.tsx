"use client";

import {
  type Dispatch,
  Fragment,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { FieldConfig, FormValues } from "../../_lib/schema";
import type { TimeRange } from "../fields";
import {
  Checkbox,
  FileUpload,
  Radio,
  Table,
  Textfield,
  TimeRangeList,
} from "../fields";
import { FieldError, QuestionList, QuestionSection } from "../question";
import { Callout } from "./Callout";
import { Expandable } from "./Expandable";

type FormRendererProps<T extends FormValues> = {
  fields: FieldConfig[];
  values: T;
  errors: Partial<Record<keyof T, string[]>>;
  submitted: boolean;
  fieldError: (key: keyof T) => string | undefined;
  setValues: Dispatch<SetStateAction<T>>;
  /** `file` 필드용 실제 File 상태(직렬화 불가라 폼 값 밖에서 관리). */
  files?: Record<string, File | null>;
  onFileChange?: (key: string, file: File | null) => void;
};

export function FormRenderer<T extends FormValues>({
  fields,
  values,
  errors,
  submitted,
  fieldError,
  setValues,
  files,
  onFileChange,
}: FormRendererProps<T>) {
  const v = values as FormValues;

  // 필드 config는 FormValues(느슨한 타입)로 작성되고, 여기서 T 경계로 좁힌다.
  const update = (next: (prev: FormValues) => FormValues) =>
    setValues((prev) => next(prev) as T);

  const errorOf = (key: string) => errors[key as keyof T]?.[0];
  const gatedErrorOf = (key: string) => fieldError(key as keyof T);
  const isVisible = (field: FieldConfig) =>
    !("visibleWhen" in field) || !field.visibleWhen || field.visibleWhen(v);

  const control = (field: FieldConfig) => {
    switch (field.type) {
      case "text":
      case "textarea":
        return (
          <Textfield
            multiline={field.type === "textarea"}
            maxLength={field.maxLength}
            rows={field.rows}
            required={field.required}
            value={(v[field.key] as string) ?? ""}
            onChange={(next) =>
              update((prev) => ({ ...prev, [field.key]: next }))
            }
            placeholder={field.placeholder}
            error={errorOf(field.key)}
            submitted={submitted}
          />
        );

      case "checkbox-group": {
        const gatedError = gatedErrorOf(field.key);
        return (
          <>
            <div className="flex flex-col gap-3">
              {field.options.map((option) => {
                const selected = (v[field.key] as string[] | undefined) ?? [];
                return (
                  <Checkbox
                    key={option}
                    label={option}
                    checked={selected.includes(option)}
                    error={Boolean(gatedError)}
                    onChange={(e) =>
                      update((prev) => {
                        const cur =
                          (prev[field.key] as string[] | undefined) ?? [];
                        return {
                          ...prev,
                          [field.key]: e.target.checked
                            ? [...cur, option]
                            : cur.filter((item) => item !== option),
                        };
                      })
                    }
                  />
                );
              })}
            </div>
            <div className="mt-2">
              <FieldError message={gatedError} />
            </div>
          </>
        );
      }

      case "radio-group":
        return (
          <>
            <div className="flex flex-col gap-3">
              {field.options.map((option) => (
                <Radio
                  key={option.id}
                  name={field.name}
                  label={option.label}
                  checked={v[field.key] === option.id}
                  disabled={option.disabled}
                  error={Boolean(gatedErrorOf(field.key))}
                  onChange={() =>
                    update((prev) =>
                      field.onSelect
                        ? field.onSelect(option.id, prev)
                        : { ...prev, [field.key]: option.id },
                    )
                  }
                />
              ))}
            </div>
            <div className="mt-2">
              <FieldError message={gatedErrorOf(field.key)} />
            </div>
            {field.detail && (
              <Expandable open={Boolean(field.detail(v))}>
                <Callout className="mt-8">{field.detail(v)}</Callout>
              </Expandable>
            )}
          </>
        );

      case "radio-matrix":
        return (
          <>
            <Table
              variant="radio"
              name={field.name}
              columns={field.columns}
              error={Boolean(gatedErrorOf(field.key))}
              rows={field.rows.map((row) => ({
                id: row.id,
                label: row.label,
                cells: field.columns.map((_, columnIndex) => {
                  const cellValue = field.cellValue(row, columnIndex);
                  return {
                    id: cellValue,
                    "aria-label": field.cellAriaLabel?.(row, columnIndex),
                    checked: v[field.key] === cellValue,
                    onChange: () =>
                      update((prev) => ({ ...prev, [field.key]: cellValue })),
                  };
                }),
              }))}
            />
            <div className="mt-2">
              <FieldError message={gatedErrorOf(field.key)} />
            </div>
          </>
        );

      case "checkbox-matrix": {
        const disabled = field.disabledWhen?.(v) ?? false;
        const extra = field.extraCheckbox;
        const timeRange = extra?.timeRange;
        return (
          <>
            {field.groups.map((group) => (
              <Table
                key={group.slots.join(",")}
                cornerLabel={group.cornerLabel}
                className={group.className}
                columns={group.columns}
                error={Boolean(gatedErrorOf(field.key))}
                rows={group.rows.map((row) => ({
                  id: row.id,
                  label: row.label,
                  cells: group.slots.map((slot) => ({
                    id: `${row.id}-${slot}`,
                    "aria-label": field.cellAriaLabel?.(row, slot),
                    checked: field.getChecked(v, row.id, slot),
                    disabled:
                      disabled ||
                      !(group.isSlotAvailable?.(row.id, slot) ?? true),
                    onChange: (checked: boolean) =>
                      update((prev) =>
                        field.onToggle(prev, row.id, slot, checked),
                      ),
                  })),
                }))}
              />
            ))}
            {extra && (
              <>
                <Checkbox
                  label={extra.label}
                  checked={Boolean(v[extra.key])}
                  onChange={(e) =>
                    update((prev) =>
                      extra.onToggle
                        ? extra.onToggle(e.target.checked, prev)
                        : { ...prev, [extra.key]: e.target.checked },
                    )
                  }
                  className="mt-4"
                />
                {timeRange && (
                  <Expandable open={Boolean(v[extra.key])}>
                    <div id={`field-${timeRange.key}`} className="mt-6">
                      {timeRange.description && (
                        <p className="mb-4 text-ink text-lg">
                          {timeRange.description}
                        </p>
                      )}
                      <TimeRangeList
                        value={(v[timeRange.key] as TimeRange[]) ?? []}
                        onChange={(next) =>
                          update((prev) => ({ ...prev, [timeRange.key]: next }))
                        }
                        min={timeRange.min}
                        max={timeRange.max}
                        error={gatedErrorOf(timeRange.key)}
                        submitted={submitted}
                      />
                    </div>
                  </Expandable>
                )}
              </>
            )}
            <div className="mt-2">
              <FieldError message={gatedErrorOf(field.key)} />
            </div>
          </>
        );
      }

      case "file": {
        const ownError = gatedErrorOf(field.key);
        const sharedError = field.sharedErrorKey
          ? gatedErrorOf(field.sharedErrorKey)
          : undefined;
        const displayError = ownError ?? sharedError;
        return (
          <>
            <FileUpload
              file={files?.[field.key] ?? null}
              onChange={(next) => onFileChange?.(field.key, next)}
              accept={field.accept}
              maxSize={field.maxSize}
              error={Boolean(displayError)}
            />
            <div className="mt-2">
              <FieldError message={displayError} />
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  const consent = (field: Extract<FieldConfig, { type: "consent" }>) => (
    <Fragment key={field.key}>
      <Callout>
        <p className="font-semibold">{field.heading}</p>
        <div className="mt-4 flex flex-col gap-1">{field.body}</div>
      </Callout>
      <div id={`field-${field.key}`}>
        <Checkbox
          label={field.checkboxLabel}
          checked={Boolean(v[field.key])}
          error={Boolean(gatedErrorOf(field.key))}
          onChange={(e) =>
            update((prev) => ({ ...prev, [field.key]: e.target.checked }))
          }
        />
        <div className="mt-2">
          <FieldError message={gatedErrorOf(field.key)} />
        </div>
      </div>
    </Fragment>
  );

  const numbered = (field: FieldConfig, animateOnMount: boolean): ReactNode => {
    if (field.type === "dynamic") {
      return field.resolve(v).map((child) => numbered(child, animateOnMount));
    }
    return (
      <QuestionSection
        key={field.key}
        id={`field-${field.key}`}
        title={field.title}
        description={field.description}
        callout={field.callout}
        visible={isVisible(field)}
        animateOnMount={animateOnMount}
      >
        {control(field)}
      </QuestionSection>
    );
  };

  const isUnnumbered = (field: FieldConfig) =>
    "unnumbered" in field && field.unnumbered;
  const preludeFields = fields.filter(isUnnumbered);
  const numberedFields = fields.filter((field) => !isUnnumbered(field));

  return (
    <>
      {preludeFields.map((field) =>
        field.type === "consent" ? consent(field) : null,
      )}
      <QuestionList>
        {numberedFields.map((field) => numbered(field, false))}
      </QuestionList>
    </>
  );
}
