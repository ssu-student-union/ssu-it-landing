import "server-only";

import { del } from "@vercel/blob";
import { MAX_FILE_SIZE } from "../app/recruiting/portfolio/constants";

/** Vercel Blob 공개 URL의 호스트 접미사. */
const ALLOWED_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** 위조 URL로 서버가 임의 호스트를 fetch(SSRF)하지 않도록 Blob 호스트만 허용한다. */
export function isAllowedBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(ALLOWED_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}

export class BlobFetchError extends Error {
  constructor(public readonly reason: "file_too_large" | "fetch_failed") {
    super(reason);
  }
}

/** Blob 바이트를 내려받아 File로 만든다. 업로드 토큰의 크기 제한과 별개로
 * content-length·실제 바이트 양쪽에서 크기를 재검증한다 — 메타는 클라이언트 입력이라 못 믿는다. */
export async function fetchPortfolioBlob(meta: {
  name: string;
  url: string;
}): Promise<File> {
  const response = await fetch(meta.url);
  if (!response.ok) {
    throw new BlobFetchError("fetch_failed");
  }

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_FILE_SIZE) {
    throw new BlobFetchError("file_too_large");
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_FILE_SIZE) {
    throw new BlobFetchError("file_too_large");
  }

  return new File([buffer], meta.name, {
    type: response.headers.get("content-type") ?? undefined,
  });
}

/** 포트폴리오는 PII — Notion 전달이 끝나면 즉시 삭제한다. 부가 동작이므로 절대 throw하지 않는다. */
export async function deletePortfolioBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error("Blob 삭제 실패:", error);
  }
}
