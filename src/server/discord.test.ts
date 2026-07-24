import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { notifyNotionFailureToDiscord, notifySubmissionToDiscord } =
  await import("./discord");

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

describe("notifyNotionFailureToDiscord", () => {
  it("웹훅 URL 미설정이면 아무것도 보내지 않는다", async () => {
    vi.stubEnv("DISCORD_ABUSE_WEBHOOK_URL", "");
    await notifyNotionFailureToDiscord({
      endpoint: "submit",
      error: new Error("Notion API 오류"),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("엔드포인트·에러 메시지를 embed field로 보낸다", async () => {
    await notifyNotionFailureToDiscord({
      endpoint: "submit",
      error: new Error("Notion API 오류"),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://discord.test/abuse",
      expect.objectContaining({ method: "POST" }),
    );
    expect(sentEmbed().fields).toEqual([
      { name: "엔드포인트", value: "submit", inline: true },
      { name: "에러", value: "Notion API 오류", inline: false },
    ]);
  });

  it("Error가 아닌 값은 문자열로 변환해 보낸다", async () => {
    await notifyNotionFailureToDiscord({
      endpoint: "notify",
      error: "unexpected string",
    });

    expect(sentEmbed().fields).toEqual([
      { name: "엔드포인트", value: "notify", inline: true },
      { name: "에러", value: "unexpected string", inline: false },
    ]);
  });

  it("응답이 ok가 아니어도 예외를 전파하지 않는다", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchMock.mockResolvedValue({ ok: false, status: 429 });

    await expect(
      notifyNotionFailureToDiscord({
        endpoint: "submit",
        error: new Error("Notion API 오류"),
      }),
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
