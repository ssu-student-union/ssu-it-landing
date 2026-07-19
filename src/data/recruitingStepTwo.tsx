import type { ReactNode } from "react";
import type { QuestionConfig } from "../app/recruiting/_lib/schema";

export type DepartmentId = "PM" | "Design" | "Frontend" | "Backend" | "HR";

export type Department = {
  id: DepartmentId;
  label: string;
  requirements: ReactNode;
  questions: QuestionConfig[];
};

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

const commonQuestions = (
  taskOptions: string[],
  skillPlaceholder: string,
): QuestionConfig[] => [
  {
    key: "tasks",
    type: "checkbox-group",
    title: "해당 분야에서 본인이 더 기여하고 싶은 Task를 선택해주세요.",
    options: taskOptions,
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
    placeholder: skillPlaceholder,
    maxLength: 500,
    rows: 4,
  },
];

export const departments: Department[] = [
  {
    id: "PM",
    label: "PM",
    requirements: <p>[필수] 일정 및 이슈 관리 가능자 (플레이스홀더)</p>,
    questions: commonQuestions(
      ["일정/이슈 관리", "요구사항 정의"],
      "ex) Notion / 중 / 프로젝트 일정 관리 경험 (플레이스홀더)",
    ),
  },
  {
    id: "Design",
    label: "Design",
    requirements: (
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
    questions: commonQuestions(
      ["UI/UX 디자인 유지보수", "IT지원위원회의 서비스 마케팅/굿즈 제작"],
      "ex) Figma / 중 / Component, AutoLayout 등 주요 기능을 활용하여 원하는 결과물 제작 가능",
    ),
  },
  {
    id: "Frontend",
    label: "Frontend",
    requirements: <p>[필수] React 사용 가능자 (플레이스홀더)</p>,
    questions: commonQuestions(
      ["신규 기능 개발", "유지보수"],
      "ex) React / 중 / 컴포넌트 설계 경험 (플레이스홀더)",
    ),
  },
  {
    id: "Backend",
    label: "Backend",
    requirements: (
      <p>[필수] Node.js 또는 유사 스택 사용 가능자 (플레이스홀더)</p>
    ),
    questions: commonQuestions(
      ["API 개발", "인프라 관리"],
      "ex) Node.js / 중 / API 설계 경험 (플레이스홀더)",
    ),
  },
  {
    id: "HR",
    label: "HR",
    requirements: <p>[필수] 인사/조직 운영 관심자 (플레이스홀더)</p>,
    questions: commonQuestions(
      ["채용 프로세스 운영", "조직 문화 기획"],
      "ex) 채용 프로세스 기획 경험 (플레이스홀더)",
    ),
  },
];
