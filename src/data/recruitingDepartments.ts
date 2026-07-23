export type DepartmentId = "pm" | "design" | "frontend" | "backend" | "hr";

/**
 * 지원 부서의 순수 도메인 값. Step1 부서 선택 라디오, Notion "지원 부서" select 등
 * 여러 곳이 공유하는 id/label만 둔다. task 옵션·면접 일정처럼 그 부서의 폼 필드
 * 하나에만 쓰이는 값은 `motivation/_departments/`의 해당 부서 파일에 직접 둔다.
 */
export type Department = {
  id: DepartmentId;
  label: string;
};

export const departments: Department[] = [
  { id: "pm", label: "PM" },
  { id: "design", label: "Design" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "hr", label: "HR" },
];

/** 값이 실제로 존재하는 부서 id인지 확인한다. 폼(클라이언트)·서버 재검증 양쪽에서 공유. */
export function isDepartmentId(value: string): value is DepartmentId {
  return departments.some((department) => department.id === value);
}
