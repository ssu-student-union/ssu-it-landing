import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const notifyAbuseToDiscord = vi.fn();
vi.mock("./discord", () => ({
  notifyAbuseToDiscord: (entry: unknown) => notifyAbuseToDiscord(entry),
}));

const { logAbuseAttempt } = await import("./abuseLog");

/** 모듈 스코프 IP별 카운터가 테스트 간 섞이지 않도록 테스트마다 고유 IP를 쓴다. */
let ipSeq = 0;
function requestFrom(ip?: string, userAgent?: string): Request {
  ipSeq += 1;
  return new Request("https://example.com/api/recruiting/submit", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip ?? `10.0.0.${ipSeq}, 172.16.0.1`,
      ...(userAgent ? { "user-agent": userAgent } : {}),
    },
  });
}

beforeEach(() => {
  notifyAbuseToDiscord.mockReset().mockResolvedValue(undefined);
});

describe("logAbuseAttempt", () => {
  it("x-forwarded-for 첫 값을 IP로 추출해 사유·상세와 함께 Discord로 넘긴다", async () => {
    await logAbuseAttempt({
      reason: "bot_detected",
      endpoint: "submit",
      request: requestFrom("203.0.113.9, 172.16.0.1", "curl/8.0"),
      detail: "테스트 상세",
    });

    expect(notifyAbuseToDiscord).toHaveBeenCalledWith({
      reason: "bot_detected",
      endpoint: "submit",
      ip: "203.0.113.9",
      userAgent: "curl/8.0",
      detail: "테스트 상세",
    });
  });

  it("x-forwarded-for가 없으면 IP를 unknown으로 기록한다", async () => {
    await logAbuseAttempt({
      reason: "invalid_email",
      endpoint: "notify",
      request: new Request("https://example.com/api/recruiting/notify", {
        method: "POST",
      }),
    });

    expect(notifyAbuseToDiscord).toHaveBeenCalledWith(
      expect.objectContaining({ ip: "unknown" }),
    );
  });

  it("같은 IP는 분당 5건까지만 알린다", async () => {
    const ip = "198.51.100.1";
    for (let i = 0; i < 7; i += 1) {
      await logAbuseAttempt({
        reason: "invalid_request",
        endpoint: "submit",
        request: requestFrom(ip),
      });
    }
    expect(notifyAbuseToDiscord).toHaveBeenCalledTimes(5);
  });
});
