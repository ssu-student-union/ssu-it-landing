import "server-only";

import type { ValidatedRecruitingSubmission } from "../../app/recruiting/_lib/schema";
import { getNotionClient } from "./client";
import { mapPayloadToProperties } from "./mapPayloadToProperties";
import { resolveDataSourceId } from "./resolveDataSource";
import { uploadPortfolioFile } from "./uploadPortfolioFile";

/** 검증된 지원서 데이터를 Notion 데이터베이스에 페이지 하나로 저장한다. */
export async function submitRecruitingApplication(
  submission: ValidatedRecruitingSubmission,
  file: File | undefined,
): Promise<{ pageId: string }> {
  const client = getNotionClient();

  const [dataSourceId, fileUploadId] = await Promise.all([
    resolveDataSourceId(),
    file ? uploadPortfolioFile(file) : Promise.resolve(undefined),
  ]);

  const properties = mapPayloadToProperties(submission, fileUploadId);

  const page = await client.pages.create({
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties,
  });

  return { pageId: page.id };
}
