import { describe, expect, it } from "vitest";
import { NOTION_TEXT_MAX_LENGTH } from "../../app/recruiting/_lib/schema";
import type { StepTwoFormData } from "../../app/recruiting/motivation/schema";
import type { StepOneFormData } from "../../app/recruiting/personal-info/schema";
import type { StepThreeFormData } from "../../app/recruiting/portfolio/schema";
import { mapPayloadToProperties } from "./mapPayloadToProperties";
import { NOTION_PROPERTIES } from "./propertyNames";

const stepOne: StepOneFormData = {
  agree: true,
  name: "홍길동",
  studentId: "20240000",
  phone: "010-1234-5678",
  college: "정보과학대학",
  major: "IT융합전공",
  grade: "2학년 1학기",
  department: "pm",
};

const baseStepTwo: StepTwoFormData = {
  department: "pm",
  interviewAvailability: {},
  noAvailableTime: false,
  otherTime: [],
  taskPriorities: {},
};

const stepThree: StepThreeFormData = {
  portfolioLink: "https://example.com",
  portfolioFile: null,
  activityCommitmentAck: true,
};

function properties(
  stepTwo: StepTwoFormData,
  fileUploadId?: string,
  overrides?: Partial<StepThreeFormData>,
) {
  return mapPayloadToProperties(
    { stepOne, stepTwo, stepThree: { ...stepThree, ...overrides } },
    fileUploadId,
  );
}

describe("mapPayloadToProperties — skillAnswer 폴백", () => {
  it("skillAnswer가 있으면 그대로 쓴다", () => {
    const props = properties({
      ...baseStepTwo,
      skillAnswer: "역량 서술",
      priorityTaskStrategy: "우선순위 전략",
    });
    expect(props[NOTION_PROPERTIES.skillAnswer]).toEqual({
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: "역량 서술" } }],
    });
  });

  it("skillAnswer가 없으면 priorityTaskStrategy로 폴백한다(PM 부서 회귀 케이스)", () => {
    const props = properties({
      ...baseStepTwo,
      priorityTaskStrategy: "우선순위 전략",
    });
    expect(props[NOTION_PROPERTIES.skillAnswer]).toEqual({
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: "우선순위 전략" } }],
    });
  });

  it("둘 다 없으면 빈 rich_text가 된다(예외를 던지지 않는다)", () => {
    const props = properties(baseStepTwo);
    expect(props[NOTION_PROPERTIES.skillAnswer]).toEqual({
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: "" } }],
    });
  });

  it("HR은 두 경험 문항을 라벨과 함께 이어붙인다", () => {
    const props = properties({
      ...baseStepTwo,
      processStructureExperience: "운영 구조 경험",
      stakeholderCoordinationExperience: "이해관계자 조율 경험",
    });
    expect(props[NOTION_PROPERTIES.skillAnswer]).toEqual({
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content:
              "[운영 구조 개선 경험]\n운영 구조 경험\n\n[이해관계자 조율 경험]\n이해관계자 조율 경험",
          },
        },
      ],
    });
  });

  it("HR 문항 중 하나만 채워도 그 하나만 라벨과 함께 담는다", () => {
    const props = properties({
      ...baseStepTwo,
      processStructureExperience: "운영 구조 경험",
    });
    expect(props[NOTION_PROPERTIES.skillAnswer]).toEqual({
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "[운영 구조 개선 경험]\n운영 구조 경험" },
        },
      ],
    });
  });
});

describe("mapPayloadToProperties — taskPriorities → 희망 Task", () => {
  it("순위(1~4) 오름차순으로 라벨 배열을 만든다", () => {
    const props = properties({
      ...baseStepTwo,
      taskPriorities: {
        "student-council-site": "2",
        ssuport: "1",
        etc: "4",
        "club-council-site": "3",
      },
    });
    expect(props[NOTION_PROPERTIES.tasks]).toEqual({
      type: "multi_select",
      multi_select: [
        { name: "SSUport (특별장학금)" },
        { name: "총학생회 홈페이지" },
        { name: "동아리연합회 홈페이지" },
        { name: "기타" },
      ],
    });
  });

  it("PM 필드 설정에 없는 rowId는 원본 rowId를 그대로 라벨로 쓴다", () => {
    const props = properties({
      ...baseStepTwo,
      taskPriorities: { "unknown-row": "1" },
    });
    expect(props[NOTION_PROPERTIES.tasks]).toEqual({
      type: "multi_select",
      multi_select: [{ name: "unknown-row" }],
    });
  });

  it("taskPriorities가 비어있으면(비-PM 부서) tasks만 그대로 반영된다", () => {
    const props = properties({
      ...baseStepTwo,
      tasks: ["기존 task"],
      taskPriorities: {},
    });
    expect(props[NOTION_PROPERTIES.tasks]).toEqual({
      type: "multi_select",
      multi_select: [{ name: "기존 task" }],
    });
  });
});

describe("mapPayloadToProperties — 면접 일정 요약", () => {
  it("noAvailableTime이 true면 [대체 일정] 접두어가 붙는다", () => {
    const props = properties({
      ...baseStepTwo,
      noAvailableTime: true,
      otherTime: [{ start: "2026-08-01T19:00", end: "2026-08-01T20:00" }],
    });
    const value = props[NOTION_PROPERTIES.interviewSchedule];
    expect(value).toMatchObject({
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: expect.stringContaining("[대체 일정]") },
        },
      ],
    });
  });

  it("noAvailableTime이 false면 접두어 없이 표준 슬롯 요약을 쓴다", () => {
    const props = properties({
      ...baseStepTwo,
      interviewAvailability: { "2026-08-01": ["19:00"] },
    });
    const value = props[NOTION_PROPERTIES.interviewSchedule];
    expect(value).toMatchObject({
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: expect.not.stringContaining("[대체 일정]") },
        },
      ],
    });
  });
});

describe("mapPayloadToProperties — clampToNotionLimit", () => {
  it("2000자를 초과하는 rich_text는 정확히 2000자로 잘린다", () => {
    const longText = "가".repeat(NOTION_TEXT_MAX_LENGTH + 100);
    const props = properties({ ...baseStepTwo, motivation: longText });
    const value = props[NOTION_PROPERTIES.motivation];
    expect(value).toMatchObject({ type: "rich_text" });
    if (value.type === "rich_text") {
      expect(value.rich_text?.[0]).toMatchObject({
        text: { content: expect.any(String) },
      });
      const content = (value.rich_text?.[0] as { text: { content: string } })
        .text.content;
      expect(content).toHaveLength(NOTION_TEXT_MAX_LENGTH);
    }
  });
});

describe("mapPayloadToProperties — 포트폴리오 파일/링크", () => {
  it("fileUploadId가 없으면 files 배열이 비어있다", () => {
    const props = properties(baseStepTwo, undefined);
    expect(props[NOTION_PROPERTIES.portfolioFile]).toEqual({
      type: "files",
      files: [],
    });
  });

  it("fileUploadId가 있으면 파일명과 함께 files 배열에 담긴다", () => {
    const props = properties(baseStepTwo, "upload-123", {
      portfolioFile: { name: "portfolio.pdf", size: 1024 },
    });
    expect(props[NOTION_PROPERTIES.portfolioFile]).toEqual({
      type: "files",
      files: [
        {
          type: "file_upload",
          file_upload: { id: "upload-123" },
          name: "portfolio.pdf",
        },
      ],
    });
  });

  it("portfolioLink가 빈 문자열이면 url이 null이 된다", () => {
    const props = properties(baseStepTwo, undefined, { portfolioLink: "" });
    expect(props[NOTION_PROPERTIES.portfolioLink]).toEqual({
      type: "url",
      url: null,
    });
  });

  it("activityCommitmentAck 체크 여부를 checkbox로 그대로 옮긴다", () => {
    const props = properties(baseStepTwo, undefined, {
      activityCommitmentAck: true,
    });
    expect(props[NOTION_PROPERTIES.activityCommitmentAck]).toEqual({
      type: "checkbox",
      checkbox: true,
    });
  });
});
