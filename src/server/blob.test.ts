import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_FILE_SIZE } from "../app/recruiting/portfolio/constants";

vi.mock("server-only", () => ({}));

const { delMock, getMock } = vi.hoisted(() => ({
  delMock: vi.fn(),
  getMock: vi.fn(),
}));
vi.mock("@vercel/blob", () => ({ del: delMock, get: getMock }));

const {
  BlobFetchError,
  deletePortfolioBlob,
  fetchPortfolioBlob,
  isAllowedBlobUrl,
} = await import("./blob");

const BLOB_URL =
  "https://abc123.private.blob.vercel-storage.com/portfolio/portfolio-x1y2.pdf";

describe("isAllowedBlobUrl", () => {
  it("Vercel Blob 공개 URL이면 true", () => {
    expect(isAllowedBlobUrl(BLOB_URL)).toBe(true);
  });

  it.each([
    ["http 프로토콜", "http://abc123.private.blob.vercel-storage.com/a.pdf"],
    ["임의 호스트", "https://evil.com/a.pdf"],
    [
      "접미사 위장 호스트",
      "https://private.blob.vercel-storage.com.evil.com/a.pdf",
    ],
    ["쿼리스트링 트릭", "https://evil.com/?x=.private.blob.vercel-storage.com"],
    ["URL이 아닌 문자열", "not-a-url"],
  ])("%s는 false", (_label, url) => {
    expect(isAllowedBlobUrl(url)).toBe(false);
  });
});

describe("fetchPortfolioBlob", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  function okResponse(body: ArrayBuffer, headers: Record<string, string>) {
    return {
      headers: new Headers(headers),
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(body));
          controller.close();
        },
      }),
    };
  }

  it("바이트를 내려받아 이름·타입이 유지된 File을 만든다", async () => {
    const bytes = new TextEncoder().encode("pdf-bytes");
    getMock.mockResolvedValue(
      okResponse(bytes.buffer as ArrayBuffer, {
        "content-length": String(bytes.byteLength),
        "content-type": "application/pdf",
      }),
    );

    const file = await fetchPortfolioBlob({
      name: "portfolio.pdf",
      url: BLOB_URL,
    });

    expect(getMock).toHaveBeenCalledWith(BLOB_URL, { access: "private" });
    expect(file.name).toBe("portfolio.pdf");
    expect(file.type).toBe("application/pdf");
    expect(file.size).toBe(bytes.byteLength);
  });

  it("content-length가 제한을 초과하면 스트림을 소비하지 않고 file_too_large", async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(1));
        controller.close();
      },
    });
    getMock.mockResolvedValue({
      headers: new Headers({ "content-length": String(MAX_FILE_SIZE + 1) }),
      stream,
    });

    await expect(
      fetchPortfolioBlob({ name: "huge.pdf", url: BLOB_URL }),
    ).rejects.toThrow(new BlobFetchError("file_too_large"));
    // content-length 검사에서 조기 반환하므로 스트림이 소비(lock)되지 않아야 한다.
    expect(stream.locked).toBe(false);
  });

  it("content-length가 없어도 실제 바이트가 제한을 초과하면 file_too_large", async () => {
    getMock.mockResolvedValue(
      okResponse(new ArrayBuffer(MAX_FILE_SIZE + 1), {}),
    );

    await expect(
      fetchPortfolioBlob({ name: "huge.pdf", url: BLOB_URL }),
    ).rejects.toThrow(new BlobFetchError("file_too_large"));
  });

  it("응답이 ok가 아니면 fetch_failed", async () => {
    getMock.mockResolvedValue(null);

    await expect(
      fetchPortfolioBlob({ name: "gone.pdf", url: BLOB_URL }),
    ).rejects.toThrow(new BlobFetchError("fetch_failed"));
  });
});

describe("deletePortfolioBlob", () => {
  beforeEach(() => {
    delMock.mockReset().mockResolvedValue(undefined);
  });

  it("blob del을 호출한다", async () => {
    await deletePortfolioBlob(BLOB_URL);
    expect(delMock).toHaveBeenCalledWith(BLOB_URL);
  });

  it("삭제가 실패해도 예외를 전파하지 않는다", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    delMock.mockRejectedValue(new Error("boom"));

    await expect(deletePortfolioBlob(BLOB_URL)).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
