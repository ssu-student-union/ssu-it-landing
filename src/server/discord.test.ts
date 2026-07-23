import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { notifyAbuseToDiscord, notifySubmissionToDiscord } = await import(
  "./discord"
);

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ ok: true, status: 204 });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("DISCORD_SUBMIT_WEBHOOK_URL", "https://discord.test/submit");
  vi.stubEnv("DISCORD_ABUSE_WEBHOOK_URL", "https://discord.test/abuse");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function sentEmbed() {
  const [, init] = fetchMock.mock.calls[0];
  return JSON.parse(init.body).embeds[0];
}

describe("notifySubmissionToDiscord", () => {
  it("웹훅 URL 미설정이면 아무것도 보내지 않는다", async () => {
    vi.stubEnv("DISCORD_SUBMIT_WEBHOOK_URL", "");
    await notifySubmissionToDiscord({ name: "홍길동", departmentLabel: "PM" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("이름·지원 부서를 embed field로 보낸다", async () => {
    await notifySubmissionToDiscord({ name: "홍길동", departmentLabel: "PM" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://discord.test/submit",
      expect.objectContaining({ method: "POST" }),
    );
    expect(sentEmbed().fields).toEqual([
      { name: "이름", value: "홍길동", inline: true },
      { name: "지원 부서", value: "PM", inline: true },
    ]);
  });

  it("웹훅 호출이 실패해도 예외를 전파하지 않는다", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(
      notifySubmissionToDiscord({ name: "홍길동", departmentLabel: "PM" }),
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe("notifyAbuseToDiscord", () => {
  const entry = {
    reason: "bot_detected",
    endpoint: "submit",
    ip: "203.0.113.9",
    userAgent: "curl/8.0",
  };

  it("사유·엔드포인트·IP·UA를 embed field로 보낸다", async () => {
    await notifyAbuseToDiscord(entry);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://discord.test/abuse",
      expect.anything(),
    );
    expect(sentEmbed().fields).toEqual([
      { name: "사유", value: "bot_detected", inline: true },
      { name: "엔드포인트", value: "submit", inline: true },
      { name: "IP", value: "203.0.113.9", inline: true },
      { name: "User-Agent", value: "curl/8.0", inline: false },
    ]);
  });

  it("긴 값은 Discord field 한도(1024자)로 자르고, 빈 값은 '-'로 채운다", async () => {
    await notifyAbuseToDiscord({
      ...entry,
      userAgent: "",
      detail: "a".repeat(2000),
    });

    const fields = sentEmbed().fields;
    expect(fields[3].value).toBe("-");
    expect(fields[4].value).toHaveLength(1024);
    expect(fields[4].value.endsWith("…")).toBe(true);
  });

  it("응답이 ok가 아니어도 예외를 전파하지 않는다", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchMock.mockResolvedValue({ ok: false, status: 429 });

    await expect(notifyAbuseToDiscord(entry)).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
