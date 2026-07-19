import type { ReactNode } from "react";
import {
  type Department,
  type DepartmentId,
  departments,
} from "../../../data/recruitingDepartments";
import { buildEmptyAnswers, type FieldConfig } from "../_lib/schema";

const highlight = (text: string) => (
  <b className="font-extrabold text-brand">{text}</b>
);

const motivationDescription = (
  <>
    IT지원위원회에 {highlight("지원하게 된 계기")}를 구체적으로 설명
    <br />
    본인이 기대하는 {highlight("배움과 성장의 방향")} 제시
    <br />
    IT지원위원회에서 {highlight("기여하고 싶은 부분")} 명확히 서술
  </>
);

const fitCallout = (
  <>
    <p>{highlight("의사소통")}이 원활한 분</p>
    <p>
      자신의 {highlight("리소스를 파악")}하고 {highlight("책임감")} 있게 일하는
      분
    </p>
    <p>{highlight("학생 사회에 기여")}하고 싶은 분</p>
    <p>밀도 있는 {highlight("성장")}을 원하는 분</p>
  </>
);

/** 부서별 자격 요건. 선택 시 애니메이션 박스로 보여준다. */
const departmentRequirements: Record<DepartmentId, ReactNode> = {
  PM: <p>[필수] 일정 및 이슈 관리 가능자 (플레이스홀더)</p>,
  Design: (
    <>
      <p>
        <b className="font-bold">[필수]</b>{" "}
        <b className="font-semibold">Figma 사용 가능자</b>
      </p>
      <p>
        - Auto Layout 활용 가능자
        <br />- min, max-width 이용 반응형 페이지 제작 가능자
        <br />- 서비스 디자인 유경험자
      </p>
      <p>
        <b className="font-bold">[필수]</b> 디자인 시스템 구축 가능자
      </p>
      <p className="mt-4 font-semibold">마케팅 디자인</p>
      <p>
        <b className="font-bold">[필수]</b> Figma 사용 가능자
      </p>
      <p>
        <b className="font-bold">[우대]</b> SNS 마케팅, 카드 뉴스, 내부 굿즈
        제작 가능자
      </p>
      <p>
        <b className="font-bold">[우대]</b> AI 툴 사용 가능자
      </p>
      <p>
        <b className="font-bold">[우대]</b> 3D 툴 사용 가능자
      </p>
    </>
  ),
  Frontend: <p>[필수] React 사용 가능자 (플레이스홀더)</p>,
  Backend: <p>[필수] Node.js 또는 유사 스택 사용 가능자 (플레이스홀더)</p>,
  HR: <p>[필수] 인사/조직 운영 관심자 (플레이스홀더)</p>,
};

/** "역량 서술" textarea placeholder. */
const departmentSkillPlaceholder: Record<DepartmentId, string> = {
  PM: "ex) Notion / 중 / 프로젝트 일정 관리 경험 (플레이스홀더)",
  Design:
    "ex) Figma / 중 / Component, AutoLayout 등 주요 기능을 활용하여 원하는 결과물 제작 가능",
  Frontend: "ex) React / 중 / 컴포넌트 설계 경험 (플레이스홀더)",
  Backend: "ex) Node.js / 중 / API 설계 경험 (플레이스홀더)",
  HR: "ex) 채용 프로세스 기획 경험 (플레이스홀더)",
};

/** 부서 도메인 값으로 그 부서의 문항 FieldConfig를 조립한다(모든 부서 공통 구조 + 부서별 옵션/placeholder). */
function buildDepartmentQuestions(department: Department): FieldConfig[] {
  return [
    {
      key: "tasks",
      type: "checkbox-group",
      title: "해당 분야에서 본인이 더 기여하고 싶은 Task를 선택해주세요.",
      options: department.taskOptions,
    },
    {
      key: "motivation",
      type: "textarea",
      title: "IT지원위원회에 지원한 이유는 무엇인가요? (500자 이내)",
      description: motivationDescription,
      maxLength: 500,
      rows: 4,
    },
    {
      key: "fitReason",
      type: "textarea",
      title:
        "지원자 본인이 IT지원위원회의 인재상의 어떠한 부분에 부합한지 서술해 주세요. (500자 이내)",
      callout: fitCallout,
      maxLength: 500,
      rows: 4,
    },
    {
      key: "skillAnswer",
      type: "textarea",
      title:
        "해당 분야와 관련된 본인의 역량을 구체적으로 서술해주세요. (500자 이내)",
      placeholder: departmentSkillPlaceholder[department.id],
      maxLength: 500,
      rows: 4,
    },
  ];
}

const questionsFor = (id: unknown): FieldConfig[] => {
  const department = departments.find((d) => d.id === id);
  return department ? buildDepartmentQuestions(department) : [];
};

export const stepTwoFields: FieldConfig[] = [
  {
    type: "radio-group",
    key: "department",
    name: "department",
    title: "지원부서를 선택해주세요.",
    options: departments.map((d) => ({ id: d.id, label: d.label })),
    onSelect: (id) => ({
      department: id,
      ...buildEmptyAnswers(questionsFor(id)),
    }),
    detail: (values) =>
      departments.some((d) => d.id === values.department)
        ? departmentRequirements[values.department as DepartmentId]
        : undefined,
  },
  {
    type: "dynamic",
    key: "departmentQuestions",
    resolve: (values) => questionsFor(values.department),
  },
];
