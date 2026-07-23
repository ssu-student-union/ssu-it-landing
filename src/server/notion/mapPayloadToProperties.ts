import type { CreatePageParameters } from "@notionhq/client";
import { NOTION_TEXT_MAX_LENGTH } from "../../app/recruiting/_lib/schema";
import { departmentFields } from "../../app/recruiting/motivation/_departments";
import type { StepTwoFormData } from "../../app/recruiting/motivation/schema";
import type { StepOneFormData } from "../../app/recruiting/personal-info/schema";
import type { StepThreeFormData } from "../../app/recruiting/portfolio/schema";
import {
  formatInterviewDate,
  formatShortDate,
  formatSlotLabel,
} from "../../data/recruitingSchedule";
import { NOTION_PROPERTIES } from "./propertyNames";

type NotionProperties = NonNullable<CreatePageParameters["properties"]>;
type NotionPropertyValue = NotionProperties[string];

/** Notion API는 rich_text/title 콘텐츠를 2000자로 하드 제한한다. 사용자 입력
 * 필드는 이미 클라이언트 schema에서 이 길이 이하로 막지만, 면접 일정 요약처럼
 * 여러 값을 이어붙여 만드는 파생 텍스트까지 포함해 여기서 최종 방어선으로 자른다. */
const clampToNotionLimit = (content: string): string =>
  content.length > NOTION_TEXT_MAX_LENGTH
    ? content.slice(0, NOTION_TEXT_MAX_LENGTH)
    : content;

const titleValue = (content: string): NotionPropertyValue => ({
  type: "title",
  title: [{ type: "text", text: { content: clampToNotionLimit(content) } }],
});

const richTextValue = (content: string): NotionPropertyValue => ({
  type: "rich_text",
  rich_text: [{ type: "text", text: { content: clampToNotionLimit(content) } }],
});

const selectValue = (name: string): NotionPropertyValue => ({
  type: "select",
  select: name ? { name } : null,
});

const multiSelectValue = (names: string[]): NotionPropertyValue => ({
  type: "multi_select",
  multi_select: names.map((name) => ({ name })),
});

const checkboxValue = (checked: boolean): NotionPropertyValue => ({
  type: "checkbox",
  checkbox: checked,
});

const urlValue = (url: string): NotionPropertyValue => ({
  type: "url",
  url: url || null,
});

const phoneValue = (phone: string): NotionPropertyValue => ({
  type: "phone_number",
  phone_number: phone || null,
});

const filesValue = (
  fileUploadId: string | undefined,
  filename: string | undefined,
): NotionPropertyValue => ({
  type: "files",
  files: fileUploadId
    ? [
        {
          type: "file_upload",
          file_upload: { id: fileUploadId },
          name: filename,
        },
      ]
    : [],
});

// 부서마다 문항 키 집합이 달라(예: PM은 skillAnswer가 없음) 값이 없거나
// 타입이 다를 수 있어, 여기서 문자열/배열로 방어적으로 좁힌다.
const toStringValue = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value : [];

/** "역량 서술" 자리를 채우는 필드 키는 부서마다 다르다: PM은 priorityTaskStrategy,
 * HR은 별도의 두 경험 문항을 이어붙인다. */
function skillAnswerOf(stepTwo: StepTwoFormData): string {
  if (stepTwo.skillAnswer) return toStringValue(stepTwo.skillAnswer);
  if (stepTwo.priorityTaskStrategy)
    return toStringValue(stepTwo.priorityTaskStrategy);

  const process = toStringValue(stepTwo.processStructureExperience);
  const coordination = toStringValue(stepTwo.stakeholderCoordinationExperience);
  return [
    process && `[운영 구조 개선 경험]\n${process}`,
    coordination && `[이해관계자 조율 경험]\n${coordination}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

type InterviewAvailability = StepTwoFormData["interviewAvailability"];
type InterviewSlots = NonNullable<
  InterviewAvailability[keyof InterviewAvailability]
>;

function summarizeInterviewAvailability(
  availability: StepTwoFormData["interviewAvailability"],
): { dateLabels: string[]; detail: string } {
  const withSlots = Object.entries(availability).filter(
    (entry): entry is [string, InterviewSlots] =>
      Array.isArray(entry[1]) && entry[1].length > 0,
  );

  return {
    dateLabels: withSlots.map(([date]) => formatShortDate(date)),
    detail: withSlots
      .map(
        ([date, slots]) =>
          `${formatInterviewDate(date)}: ${slots.map(formatSlotLabel).join(", ")}`,
      )
      .join("\n"),
  };
}

/** PM 부서 "taskPriorities" 문항(행 id → 순위 슬롯)의 행 id를 실제 라벨로
 * 바꾸기 위해, 그 필드 설정에서 행 id → 라벨 맵을 끌어온다. */
function taskPriorityRowLabels(): Record<string, string> {
  const field = departmentFields.pm.find(
    (f) => f.type === "checkbox-matrix" && f.key === "taskPriorities",
  );
  if (!field || field.type !== "checkbox-matrix") return {};
  return Object.fromEntries(
    field.groups
      .flatMap((group) => group.rows)
      .map((row) => [row.id, String(row.label)]),
  );
}

/** `taskPriorities`(행 id → 순위 슬롯 "1"~"4")를 순위 오름차순 라벨 배열로 바꾼다.
 * PM이 아닌 부서는 이 값이 비어있어 빈 배열이 된다. Notion multi_select 태그는
 * 넘긴 순서 그대로 보여주므로, 배열 순서가 곧 순위를 나타낸다. */
function collectTaskPriorities(
  taskPriorities: StepTwoFormData["taskPriorities"],
): string[] {
  const labelsByRowId = taskPriorityRowLabels();
  const labelBySlot = new Map(
    Object.entries(taskPriorities ?? {}).map(([rowId, slot]) => [
      slot,
      labelsByRowId[rowId] ?? rowId,
    ]),
  );
  return ["1", "2", "3", "4"]
    .map((slot) => labelBySlot.get(slot))
    .filter((label): label is string => Boolean(label));
}

function summarizeOtherTime(ranges: StepTwoFormData["otherTime"]): string {
  return ranges
    .filter((range) => range.start && range.end)
    .map(
      (range) =>
        `${range.start.replace("T", " ")} ~ ${range.end.replace("T", " ")}`,
    )
    .join("\n");
}

/**
 * "면접 가능 일정" 하나로 통합된 텍스트. `noAvailableTime` 토글에 따라 지원자는
 * 표준 슬롯 상세와 대체 일정 중 하나만 채우므로(상호배타적), 채워진 쪽만 골라
 * 쓴다. 대체 일정 쪽은 `[대체 일정]` 접두어를 붙여 어느 경로로 입력됐는지
 * 이 필드 하나만 보고도 구분할 수 있게 한다.
 */
function summarizeInterviewSchedule(
  stepTwo: StepTwoFormData,
  detail: string,
): string {
  if (stepTwo.noAvailableTime) {
    return `[대체 일정] ${summarizeOtherTime(stepTwo.otherTime)}`;
  }
  return detail;
}

/** 검증된 3단계 폼 데이터 → Notion 페이지 properties. §1 매핑 표를 그대로 구현한다. */
export function mapPayloadToProperties(
  submission: {
    stepOne: StepOneFormData;
    stepTwo: StepTwoFormData;
    stepThree: StepThreeFormData;
  },
  fileUploadId: string | undefined,
): NotionProperties {
  const { stepOne, stepTwo, stepThree } = submission;
  const { dateLabels, detail } = summarizeInterviewAvailability(
    stepTwo.interviewAvailability,
  );

  return {
    [NOTION_PROPERTIES.name]: titleValue(stepOne.name),
    [NOTION_PROPERTIES.studentId]: richTextValue(stepOne.studentId),
    [NOTION_PROPERTIES.phone]: phoneValue(stepOne.phone),
    [NOTION_PROPERTIES.college]: richTextValue(stepOne.college),
    [NOTION_PROPERTIES.major]: richTextValue(stepOne.major),
    [NOTION_PROPERTIES.gradeSemester]: selectValue(stepOne.grade),
    [NOTION_PROPERTIES.consent]: checkboxValue(stepOne.agree),
    [NOTION_PROPERTIES.interviewDates]: multiSelectValue(dateLabels),
    [NOTION_PROPERTIES.interviewSchedule]: richTextValue(
      summarizeInterviewSchedule(stepTwo, detail),
    ),
    [NOTION_PROPERTIES.needsAlternateTime]: checkboxValue(
      stepTwo.noAvailableTime,
    ),
    [NOTION_PROPERTIES.recruitingDepartment]: selectValue(stepOne.department),
    [NOTION_PROPERTIES.tasks]: multiSelectValue([
      ...toStringArray(stepTwo.tasks),
      ...collectTaskPriorities(stepTwo.taskPriorities),
    ]),
    [NOTION_PROPERTIES.motivation]: richTextValue(
      toStringValue(stepTwo.motivation),
    ),
    [NOTION_PROPERTIES.fitReason]: richTextValue(
      toStringValue(stepTwo.fitReason),
    ),
    [NOTION_PROPERTIES.skillAnswer]: richTextValue(skillAnswerOf(stepTwo)),
    [NOTION_PROPERTIES.portfolioLink]: urlValue(stepThree.portfolioLink),
    [NOTION_PROPERTIES.portfolioFile]: filesValue(
      fileUploadId,
      stepThree.portfolioFile?.name,
    ),
    [NOTION_PROPERTIES.activityCommitmentAck]: checkboxValue(
      stepThree.activityCommitmentAck,
    ),
  };
}
