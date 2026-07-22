import { departments } from "../../../data/recruitingDepartments";
import type { FieldConfig } from "../_lib/schema";
import { departmentFields } from "./_departments";

const highlight = (text: string) => (
  <b className="font-extrabold text-brand">{text}</b>
);

/** 모든 부서 공통 문항. */
const commonQuestionFields: FieldConfig[] = [
  {
    key: "motivation",
    type: "textarea",
    title: "IT지원위원회에 지원한 이유는 무엇인가요? (500자 이내)",
    description: (
      <>
        IT지원위원회에 {highlight("지원하게 된 계기")}를 구체적으로 설명
        <br />
        본인이 기대하는 {highlight("배움과 성장의 방향")} 제시
        <br />
        IT지원위원회에서 {highlight("기여하고 싶은 부분")} 명확히 서술
      </>
    ),
    maxLength: 500,
    rows: 4,
  },
  {
    key: "fitReason",
    type: "textarea",
    title:
      "지원자 본인이 IT지원위원회의 인재상의 어떠한 부분에 부합한지 서술해 주세요. (500자 이내)",
    callout: (
      <>
        <p>{highlight("의사소통")}이 원활한 분</p>
        <p>
          자신의 {highlight("리소스를 파악")}하고 {highlight("책임감")} 있게
          일하는 분
        </p>
        <p>{highlight("학생 사회에 기여")}하고 싶은 분</p>
        <p>{highlight("밀도 있는 성장")}을 원하는 분</p>
      </>
    ),
    maxLength: 500,
    rows: 4,
  },
];

const isInterviewField = (field: FieldConfig) =>
  field.type === "checkbox-matrix" && field.key === "interviewAvailability";

export const questionsFor = (id: unknown): FieldConfig[] => {
  const department = departments.find((d) => d.id === id);
  if (!department) return [];

  // 면접 가능 시간만 맨 위로, 그 뒤에 공통 문항 → 부서 전용 문항 순서로 둔다.
  const interviewField = departmentFields[department.id].find(isInterviewField);
  const restFields = departmentFields[department.id].filter(
    (field) => !isInterviewField(field),
  );

  return interviewField
    ? [interviewField, ...commonQuestionFields, ...restFields]
    : [...commonQuestionFields, ...restFields];
};

export const stepTwoFields: FieldConfig[] = [
  {
    type: "dynamic",
    key: "departmentQuestions",
    resolve: (values) => questionsFor(values.department),
  },
];
