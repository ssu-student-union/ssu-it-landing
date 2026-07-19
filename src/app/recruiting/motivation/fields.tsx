import {
  type Department,
  type DepartmentId,
  departments,
} from "../../../data/recruitingDepartments";
import {
  formatInterviewDate,
  formatSlotLabel,
  INTERVIEW_DATES,
  INTERVIEW_PERIOD_MAX,
  INTERVIEW_PERIOD_MIN,
  isWeekendDate,
  WEEKDAY_SLOT_START_TIMES,
  WEEKEND_SLOT_START_TIMES,
} from "../../../data/recruitingSchedule";
import type { FieldConfig, FormValues } from "../_lib/schema";

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

export const questionsFor = (id: unknown): FieldConfig[] => {
  const department = departments.find((d) => d.id === id);
  return department ? buildDepartmentQuestions(department) : [];
};

type Availability = Partial<Record<string, string[]>>;

const weekdayInterviewDates = INTERVIEW_DATES.filter((d) => !isWeekendDate(d));
const weekendInterviewDates = INTERVIEW_DATES.filter(isWeekendDate);

const availabilityOf = (values: FormValues): Availability =>
  (values.interviewAvailability as Availability | undefined) ?? {};

// 시간대 선택과 "가능한 시간이 없음"은 상호배타적이라 각 필드의 onToggle이
// 서로의 값을 함께 갱신한다.
const toggleSlot = (
  selection: Availability,
  day: string,
  slot: string,
  checked: boolean,
): Availability => {
  const current = selection[day] ?? [];
  const next = checked
    ? [...current, slot]
    : current.filter((item) => item !== slot);
  return { ...selection, [day]: next };
};

export const stepTwoFields: FieldConfig[] = [
  {
    type: "checkbox-matrix",
    key: "interviewAvailability",
    title: "면접 가능한 시간을 선택해주세요.",
    groups: [
      {
        cornerLabel: "평일",
        columns: WEEKDAY_SLOT_START_TIMES.map(formatSlotLabel),
        rows: weekdayInterviewDates.map((day) => ({
          id: day,
          label: formatInterviewDate(day),
        })),
        slots: [...WEEKDAY_SLOT_START_TIMES],
      },
      {
        cornerLabel: "주말",
        className: "mt-8",
        columns: WEEKEND_SLOT_START_TIMES.map(formatSlotLabel),
        rows: weekendInterviewDates.map((day) => ({
          id: day,
          label: formatInterviewDate(day),
        })),
        slots: [...WEEKEND_SLOT_START_TIMES],
      },
    ],
    disabledWhen: (values) => Boolean(values.noAvailableTime),
    getChecked: (values, rowId, slot) =>
      availabilityOf(values)[rowId]?.includes(slot) ?? false,
    onToggle: (values, rowId, slot, checked) => ({
      interviewAvailability: toggleSlot(
        availabilityOf(values),
        rowId,
        slot,
        checked,
      ),
      noAvailableTime: checked ? false : values.noAvailableTime,
    }),
    cellAriaLabel: (row, slot) => `${formatInterviewDate(row.id)} ${slot}`,
    extraCheckbox: {
      key: "noAvailableTime",
      label: "가능한 시간이 없음",
      onToggle: (checked, values) => ({
        noAvailableTime: checked,
        interviewAvailability: checked ? {} : availabilityOf(values),
        otherTime: checked ? values.otherTime : [],
      }),
    },
  },
  {
    type: "time-range",
    key: "otherTime",
    title:
      "위에서 가능한 시간이 없다고 체크한 경우, 면접 가능한 일자 및 시간을 작성해주세요. (대면 기준)",
    min: INTERVIEW_PERIOD_MIN,
    max: INTERVIEW_PERIOD_MAX,
    visibleWhen: (values) => Boolean(values.noAvailableTime),
  },
  {
    type: "dynamic",
    key: "departmentQuestions",
    resolve: (values) => questionsFor(values.department),
  },
];
