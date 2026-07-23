/**
 * 마감 화면 "알림 신청하기" 이메일을 저장할 Notion 데이터베이스를 1회성으로
 * 생성하는 스크립트. 앱 코드에서는 import되지 않는다 — 개발자가 직접 한 번
 * 실행하는 셋업 도구다. `scripts/create-notion-database.ts`(지원서 DB)와 같은
 * 패턴이며, 이메일 하나만 저장하므로 프로퍼티가 훨씬 단순하다.
 *
 * 사전 준비 — `scripts/create-notion-database.ts`와 동일한 통합/부모 페이지를
 * 그대로 재사용할 수 있다(NOTION_API_KEY, NOTION_PARENT_PAGE_ID).
 *
 * 실행:
 *   pnpm exec tsx scripts/create-notion-notify-database.ts
 *
 * 실행 결과로 출력되는 database_id를 .env.local의 NOTION_NOTIFY_DATABASE_ID에
 * 붙여넣으면 끝.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CreateDatabaseParameters } from "@notionhq/client";
import { Client } from "@notionhq/client";
import { NOTIFY_PROPERTIES } from "../src/server/notion/propertyNames";

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
const createdTime = (): PropertyConfig => ({
  type: "created_time",
  created_time: {},
});

const properties: Record<string, PropertyConfig> = {
  [NOTIFY_PROPERTIES.email]: title(),
  [NOTIFY_PROPERTIES.submittedAt]: createdTime(),
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
    title: [{ type: "text", text: { content: "IT지원위원회 모집 알림 신청" } }],
    initial_data_source: { properties },
  });

  console.log("Notion 데이터베이스가 생성됐습니다.");
  console.log(`NOTION_NOTIFY_DATABASE_ID=${database.id}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
