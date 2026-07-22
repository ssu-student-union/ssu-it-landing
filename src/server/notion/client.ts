import "server-only";

import { Client } from "@notionhq/client";
import { getNotionEnv } from "./env";

let client: Client | undefined;

/** Notion SDK 클라이언트 싱글턴. Notion-Version을 명시해 API의 향후 기본값 변경에 영향받지 않는다. */
export function getNotionClient(): Client {
  if (!client) {
    client = new Client({
      auth: getNotionEnv().NOTION_API_KEY,
      notionVersion: "2025-09-03",
    });
  }
  return client;
}
