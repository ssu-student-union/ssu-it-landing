import type { CreatePageParameters } from "@notionhq/client";
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

const titleValue = (content: string): NotionPropertyValue => ({
  type: "title",
  title: [{ type: "text", text: { content } }],
});

const richTextValue = (content: string): NotionPropertyValue => ({
  type: "rich_text",
  rich_text: [{ type: "text", text: { content } }],
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

const toStringValue = (value: string | string[] | undefined): string =>
  typeof value === "string" ? value : "";

const toStringArray = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : [];

type InterviewAvailability = StepOneFormData["interviewAvailability"];
type InterviewSlots = NonNullable<
  InterviewAvailability[keyof InterviewAvailability]
>;

function summarizeInterviewAvailability(
  availability: StepOneFormData["interviewAvailability"],
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

function summarizeOtherTime(ranges: StepOneFormData["otherTime"]): string {
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
  stepOne: StepOneFormData,
  detail: string,
): string {
  if (stepOne.noAvailableTime) {
    return `[대체 일정] ${summarizeOtherTime(stepOne.otherTime)}`;
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
    stepOne.interviewAvailability,
  );

  return {
    [NOTION_PROPERTIES.name]: titleValue(stepOne.name),
    [NOTION_PROPERTIES.studentId]: richTextValue(stepOne.studentId),
    [NOTION_PROPERTIES.phone]: phoneValue(stepOne.phone),
    [NOTION_PROPERTIES.college]: richTextValue(stepOne.college),
    [NOTION_PROPERTIES.major]: richTextValue(stepOne.department),
    [NOTION_PROPERTIES.gradeSemester]: selectValue(stepOne.grade),
    [NOTION_PROPERTIES.consent]: checkboxValue(stepOne.agree),
    [NOTION_PROPERTIES.interviewDates]: multiSelectValue(dateLabels),
    [NOTION_PROPERTIES.interviewSchedule]: richTextValue(
      summarizeInterviewSchedule(stepOne, detail),
    ),
    [NOTION_PROPERTIES.needsAlternateTime]: checkboxValue(
      stepOne.noAvailableTime,
    ),
    [NOTION_PROPERTIES.recruitingDepartment]: selectValue(stepTwo.department),
    [NOTION_PROPERTIES.tasks]: multiSelectValue(toStringArray(stepTwo.tasks)),
    [NOTION_PROPERTIES.motivation]: richTextValue(
      toStringValue(stepTwo.motivation),
    ),
    [NOTION_PROPERTIES.fitReason]: richTextValue(
      toStringValue(stepTwo.fitReason),
    ),
    [NOTION_PROPERTIES.skillAnswer]: richTextValue(
      toStringValue(stepTwo.skillAnswer),
    ),
    [NOTION_PROPERTIES.portfolioLink]: urlValue(stepThree.portfolioLink),
    [NOTION_PROPERTIES.portfolioFile]: filesValue(
      fileUploadId,
      stepThree.portfolioFile?.name,
    ),
  };
}
