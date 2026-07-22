import "server-only";

import { getNotionClient } from "./client";
import { getNotionEnv } from "./env";

let cachedDataSourceId: string | undefined;

/**
 * 2025-09-03 Notion API 변경으로 페이지 생성은 `database_id`가 아니라
 * `data_source_id`를 요구한다. 사람은 `NOTION_DATABASE_ID`만 다루도록 하고,
 * 여기서 `databases.retrieve`로 실제 data source id를 1회 조회해 캐싱한다.
 */
export async function resolveDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;

  const client = getNotionClient();
  const { NOTION_DATABASE_ID } = getNotionEnv();
  const database = await client.databases.retrieve({
    database_id: NOTION_DATABASE_ID,
  });

  if (!("data_sources" in database) || database.data_sources.length === 0) {
    throw new Error(
      `Notion 데이터베이스(${NOTION_DATABASE_ID})에서 data source를 찾을 수 없습니다.`,
    );
  }

  const [dataSource] = database.data_sources;
  cachedDataSourceId = dataSource.id;
  return dataSource.id;
}
