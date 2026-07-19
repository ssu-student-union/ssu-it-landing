import "server-only";

import { getNotionClient } from "./client";

/**
 * Notion File Upload API(single-part). 10MB 앱 제한은 single-part 한도(20MiB)
 * 안에 들어가므로 multi-part 로직은 필요 없다.
 */
export async function uploadPortfolioFile(file: File): Promise<string> {
  const client = getNotionClient();

  const created = await client.fileUploads.create({
    filename: file.name,
    content_type: file.type || undefined,
  });

  await client.fileUploads.send({
    file_upload_id: created.id,
    file: { filename: file.name, data: file },
  });

  return created.id;
}
