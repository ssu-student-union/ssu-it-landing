/**
 * 리크루팅 지원서를 저장할 Notion 데이터베이스를 1회성으로 생성하는 스크립트.
 * 앱 코드에서는 import되지 않는다 — 개발자가 직접 한 번 실행하는 셋업 도구다.
 *
 * 사전 준비 (Notion UI에서 직접):
 *   1. notion.so/my-integrations 에서 내부 통합을 만들고 Secret을 복사 →
 *      .env.local의 NOTION_API_KEY
 *   2. 워크스페이스에 빈 페이지를 하나 만들고 "Connections"에서 위 통합을 연결 →
 *      그 페이지 ID를 .env.local의 NOTION_PARENT_PAGE_ID로
 *
 * 실행:
 *   pnpm exec tsx scripts/create-notion-database.ts
 *
 * 실행 결과로 출력되는 database_id를 .env.local의 NOTION_DATABASE_ID에 붙여넣으면 끝.
 *
 * select/multi-select 옵션은 하드코딩하지 않고 앱이 실제로 쓰는 소스에서 그대로 끌어온다
 * — 앱 UI와 Notion 프로퍼티 옵션이 어긋나지 않게 하기 위함이다. 학년/부서 목록은
 * src/data/recruitingGrades.ts·recruitingDepartments.ts에서, 희망 Task 옵션은 부서마다
 * 값이 달라 src/app/recruiting/motivation/_departments/의 각 부서 필드 설정에서 가져온다.
 *
 * 주의: 이 스크립트는 프로퍼티 스키마만 생성한다. "기본 뷰"에서 어떤 컬럼을
 * 보여줄지/그룹핑/정렬은 포함하지 않는다 — Notion 저수준 API는 필터·정렬·그룹을
 * 프로퍼티 이름이 아니라 내부 ID로 지정해야 해서 스크립트로 자동화하는 비용이
 * 실행 빈도(학기당 1회 정도) 대비 크다. 실행 후 Notion에서 직접 뷰를 정리한다.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CreateDatabaseParameters } from "@notionhq/client";
import { Client } from "@notionhq/client";
import { departmentFields } from "../src/app/recruiting/motivation/_departments";
import { departments } from "../src/data/recruitingDepartments";
import { gradeLevels, gradeSemesters } from "../src/data/recruitingGrades";
import {
  formatShortDate,
  INTERVIEW_DATES,
} from "../src/data/recruitingSchedule";
import { NOTION_PROPERTIES } from "../src/server/notion/propertyNames";

/** node --env-file 없이도 동작하도록 .env.local을 최소한으로 직접 파싱한다(별도 dotenv 의존성 추가 없이). */
function loadEnvLocal(): void {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

type PropertyConfig = NonNullable<
  NonNullable<CreateDatabaseParameters["initial_data_source"]>["properties"]
>[string];

const title = (): PropertyConfig => ({ type: "title", title: {} });
const richText = (): PropertyConfig => ({ type: "rich_text", rich_text: {} });
const phoneNumber = (): PropertyConfig => ({
  type: "phone_number",
  phone_number: {},
});
const checkbox = (): PropertyConfig => ({ type: "checkbox", checkbox: {} });
const url = (): PropertyConfig => ({ type: "url", url: {} });
const files = (): PropertyConfig => ({ type: "files", files: {} });
const createdTime = (): PropertyConfig => ({
  type: "created_time",
  created_time: {},
});
const select = (options: string[]): PropertyConfig => ({
  type: "select",
  select: { options: options.map((name) => ({ name })) },
});
const multiSelect = (options: string[]): PropertyConfig => ({
  type: "multi_select",
  multi_select: { options: options.map((name) => ({ name })) },
});

const gradeOptions = gradeLevels.flatMap((level) =>
  gradeSemesters.map((semester) => `${level}-${semester}`),
);

const departmentOptions = departments.map((department) => department.id);

const taskOptions = Array.from(
  new Set(
    Object.values(departmentFields).flatMap((fields) =>
      fields.flatMap((field) =>
        field.type === "checkbox-group" && field.key === "tasks"
          ? field.options
          : [],
      ),
    ),
  ),
);

const properties: Record<string, PropertyConfig> = {
  [NOTION_PROPERTIES.name]: title(),
  [NOTION_PROPERTIES.studentId]: richText(),
  [NOTION_PROPERTIES.phone]: phoneNumber(),
  [NOTION_PROPERTIES.college]: richText(),
  [NOTION_PROPERTIES.major]: richText(),
  [NOTION_PROPERTIES.gradeSemester]: select(gradeOptions),
  [NOTION_PROPERTIES.consent]: checkbox(),
  [NOTION_PROPERTIES.interviewDates]: multiSelect(
    INTERVIEW_DATES.map(formatShortDate),
  ),
  [NOTION_PROPERTIES.interviewSchedule]: richText(),
  [NOTION_PROPERTIES.needsAlternateTime]: checkbox(),
  [NOTION_PROPERTIES.recruitingDepartment]: select(departmentOptions),
  [NOTION_PROPERTIES.tasks]: multiSelect(taskOptions),
  [NOTION_PROPERTIES.motivation]: richText(),
  [NOTION_PROPERTIES.fitReason]: richText(),
  [NOTION_PROPERTIES.skillAnswer]: richText(),
  [NOTION_PROPERTIES.portfolioLink]: url(),
  [NOTION_PROPERTIES.portfolioFile]: files(),
  [NOTION_PROPERTIES.submittedAt]: createdTime(),
};

async function main() {
  loadEnvLocal();

  const apiKey = process.env.NOTION_API_KEY;
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
  if (!apiKey || !parentPageId) {
    console.error(
      "NOTION_API_KEY와 NOTION_PARENT_PAGE_ID를 .env.local에 설정해주세요.",
    );
    process.exit(1);
  }

  const client = new Client({ auth: apiKey, notionVersion: "2025-09-03" });

  const database = await client.databases.create({
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: "IT지원위원회 지원서" } }],
    initial_data_source: { properties },
  });

  console.log("Notion 데이터베이스가 생성됐습니다.");
  console.log(`NOTION_DATABASE_ID=${database.id}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
