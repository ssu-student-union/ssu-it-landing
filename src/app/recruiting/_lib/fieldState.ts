/** `Textfield`/`Checkbox`/`Radio`/`FileUpload`가 공유하는 테두리 색상 상태. */
export type FieldState = "default" | "selected" | "error";

export const fieldBorderClass: Record<FieldState, string> = {
  default: "border-[#c4c4c4]",
  selected: "border-[#142992]",
  error: "border-red-500",
};
