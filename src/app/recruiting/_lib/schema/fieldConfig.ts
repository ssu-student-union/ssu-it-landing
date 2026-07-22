import type { ReactNode } from "react";

/** 폼 값의 공통 형태. 필드 config의 콜백은 이 타입을 받아 필요한 키를 캐스팅해 쓴다. */
export type FormValues = Record<string, unknown>;

export type QuestionAnswer = string | string[];

type FieldBase = {
  key: string;
  title?: ReactNode;
  description?: ReactNode;
  callout?: ReactNode;
  /** `false`를 반환하면 필드를 숨긴다(표시 토글 시 높이/투명도 애니메이션). */
  visibleWhen?: (values: FormValues) => boolean;
  /** 번호가 매겨진 문항 리스트(`QuestionList`) 밖에 그린다(동의 항목 등). */
  unnumbered?: boolean;
};

type TextFieldConfig = FieldBase & {
  type: "text" | "textarea";
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
};

type CheckboxGroupConfig = FieldBase & {
  type: "checkbox-group";
  options: string[];
  required?: boolean;
};

type RadioGroupConfig = FieldBase & {
  type: "radio-group";
  name: string;
  options: { id: string; label: ReactNode; disabled?: boolean }[];
  /** 선택 시 폼 값을 통째로 대체한다(부서 변경 시 이전 답변 리셋 등). */
  onSelect?: (id: string, values: FormValues) => FormValues;
  /** 선택값에 따라 아래 애니메이션 박스로 보여줄 상세(부서 requirements 등). */
  detail?: (values: FormValues) => ReactNode;
};

type ConsentConfig = FieldBase & {
  type: "consent";
  heading: ReactNode;
  body: ReactNode;
  checkboxLabel: ReactNode;
};

type CheckboxConfig = FieldBase & {
  type: "checkbox";
  label: ReactNode;
  /** 토글 시 폼 값에 병합할 부분 업데이트(상호배타 처리 등). */
  onToggle?: (checked: boolean, values: FormValues) => FormValues;
};

type MatrixRow = { id: string; label: ReactNode };

type RadioMatrixConfig = FieldBase & {
  type: "radio-matrix";
  name: string;
  columns: string[];
  rows: MatrixRow[];
  cellValue: (row: MatrixRow, columnIndex: number) => string;
  cellAriaLabel?: (row: MatrixRow, columnIndex: number) => string;
};

type MatrixGroup = {
  cornerLabel?: ReactNode;
  columns: string[];
  rows: MatrixRow[];
  /** 각 열에 대응하는 슬롯 키(라벨과 별개의 원본 값). */
  slots: string[];
  className?: string;
  /** 특정 행에서 이 슬롯이 실제로 선택 가능한지. 생략하면 그룹의 모든 슬롯이 모든 행에서 선택 가능(기존 동작). */
  isSlotAvailable?: (rowId: string, slot: string) => boolean;
};

type CheckboxMatrixConfig = FieldBase & {
  type: "checkbox-matrix";
  groups: MatrixGroup[];
  disabledWhen?: (values: FormValues) => boolean;
  getChecked: (values: FormValues, rowId: string, slot: string) => boolean;
  /** 토글 시 폼 값에 병합할 부분 업데이트. */
  onToggle: (
    values: FormValues,
    rowId: string,
    slot: string,
    checked: boolean,
  ) => FormValues;
  cellAriaLabel?: (row: MatrixRow, slot: string) => string;
  /** 표 아래에 함께 그리는 체크박스(예: "가능한 시간이 없음"). 같은 문항으로 묶인다. */
  extraCheckbox?: {
    key: string;
    label: ReactNode;
    onToggle?: (checked: boolean, values: FormValues) => FormValues;
    /** 체크 시 같은 문항(같은 번호) 안에 이어서 보여줄 대체 일정 입력. */
    timeRange?: {
      key: string;
      description?: ReactNode;
      min?: string;
      max?: string;
    };
  };
};

type FileConfig = FieldBase & {
  type: "file";
  accept?: string;
  /** 바이트 단위 업로드 크기 제한. 업로드 UI에 파일 크기와 나란히 표시된다. */
  maxSize?: number;
  /** 다른 필드가 대표로 들고 있는 에러 키(예: "링크 또는 파일 중 하나 필수" 규칙이
   * 링크 쪽에만 issue된 경우). 메시지는 중복 표시하지 않고, 테두리만 함께 빨갛게 만든다. */
  sharedErrorKey?: string;
};

/** 현재 값에 따라 하위 필드 목록을 동적으로 만든다(부서별 문항 등). */
type DynamicConfig = {
  type: "dynamic";
  key: string;
  resolve: (values: FormValues) => FieldConfig[];
};

export type FieldConfig =
  | TextFieldConfig
  | CheckboxGroupConfig
  | RadioGroupConfig
  | ConsentConfig
  | CheckboxConfig
  | RadioMatrixConfig
  | CheckboxMatrixConfig
  | FileConfig
  | DynamicConfig;

/** 단순 필드로 `{ key: 빈 값 }`을 만든다. 배열 필드를 `undefined`로 남기면 zod가 커스텀 메시지 대신 타입 에러를 내보내므로, 타입에 맞는 빈 값으로 채운다. */
export function buildEmptyAnswers(
  fields: FieldConfig[],
): Record<string, QuestionAnswer> {
  const answers: Record<string, QuestionAnswer> = {};

  for (const field of fields) {
    if (field.type === "checkbox-group") answers[field.key] = [];
    else if (field.type === "text" || field.type === "textarea") {
      answers[field.key] = "";
    }
  }

  return answers;
}
