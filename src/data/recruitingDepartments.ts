export type DepartmentId = "PM" | "Design" | "Frontend" | "Backend" | "HR";

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
  { id: "PM", label: "PM" },
  { id: "Design", label: "Design" },
  { id: "Frontend", label: "Frontend" },
  { id: "Backend", label: "Backend" },
  { id: "HR", label: "HR" },
];
