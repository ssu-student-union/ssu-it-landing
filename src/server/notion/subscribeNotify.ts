import "server-only";

import { getNotionClient } from "./client";
import { getNotifyNotionEnv } from "./env";
import { NOTIFY_PROPERTIES } from "./propertyNames";
import { resolveDataSourceId } from "./resolveDataSource";

/** 마감 화면 "알림 신청하기" 이메일을 별도 Notion 데이터베이스에 페이지 하나로 저장한다. */
export async function subscribeRecruitingNotify(
  email: string,
): Promise<{ pageId: string }> {
  const client = getNotionClient();
  const { NOTION_NOTIFY_DATABASE_ID } = getNotifyNotionEnv();
  const dataSourceId = await resolveDataSourceId(NOTION_NOTIFY_DATABASE_ID);

  const page = await client.pages.create({
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties: {
      [NOTIFY_PROPERTIES.email]: {
        title: [{ text: { content: email } }],
      },
    },
  });

  return { pageId: page.id };
}
