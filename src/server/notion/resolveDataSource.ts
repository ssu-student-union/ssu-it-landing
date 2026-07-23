import "server-only";

import { getNotionClient } from "./client";

const cachedDataSourceIds = new Map<string, string>();

/**
 * 2025-09-03 Notion API 변경으로 페이지 생성은 `database_id`가 아니라
 * `data_source_id`를 요구한다. 사람은 database id만 다루도록 하고, 여기서
 * `databases.retrieve`로 실제 data source id를 1회 조회해 캐싱한다.
 * 지원서·알림 신청처럼 여러 데이터베이스를 쓸 수 있어 database id별로 캐싱한다.
 */
export async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = cachedDataSourceIds.get(databaseId);
  if (cached) return cached;

  const client = getNotionClient();
  const database = await client.databases.retrieve({
    database_id: databaseId,
  });

  if (!("data_sources" in database) || database.data_sources.length === 0) {
    throw new Error(
      `Notion 데이터베이스(${databaseId})에서 data source를 찾을 수 없습니다.`,
    );
  }

  const [dataSource] = database.data_sources;
  cachedDataSourceIds.set(databaseId, dataSource.id);
  return dataSource.id;
}
