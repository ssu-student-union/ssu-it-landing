export type DepartmentId = "PM" | "Design" | "Frontend" | "Backend" | "HR";

/** 지원 부서의 순수 도메인 값. requirements/문항 등 화면 콘텐츠는 `motivation/form.tsx`에 있다. */
export type Department = {
  id: DepartmentId;
  label: string;
  /** "희망 Task" 체크박스 옵션. Notion multi-select 옵션(스크립트)과 폼이 공유하는 소스다. */
  taskOptions: string[];
};

export const departments: Department[] = [
  {
    id: "PM",
    label: "PM",
    taskOptions: ["일정/이슈 관리", "요구사항 정의"],
  },
  {
    id: "Design",
    label: "Design",
    taskOptions: [
      "UI/UX 디자인 유지보수",
      "IT지원위원회의 서비스 마케팅/굿즈 제작",
    ],
  },
  {
    id: "Frontend",
    label: "Frontend",
    taskOptions: ["신규 기능 개발", "유지보수"],
  },
  {
    id: "Backend",
    label: "Backend",
    taskOptions: ["API 개발", "인프라 관리"],
  },
  {
    id: "HR",
    label: "HR",
    taskOptions: ["채용 프로세스 운영", "조직 문화 기획"],
  },
];
