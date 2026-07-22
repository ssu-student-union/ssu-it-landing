/** `Textfield`/`Checkbox`/`Radio`/`FileUpload`가 공유하는 테두리 색상 상태. */
export type FieldState = "default" | "selected" | "error";

export const fieldBorderClass: Record<FieldState, string> = {
  default: "border-line",
  selected: "border-brand",
  error: "border-red-500",
};
