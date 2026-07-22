import "server-only";

import { getNotionClient } from "./client";

/**
 * Notion File Upload API(single-part). 앱 제한(`MAX_FILE_SIZE`, portfolio/constants.ts)이
 * single-part 한도(20MiB)를 넘지 않는 한 multi-part 로직은 필요 없다.
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
