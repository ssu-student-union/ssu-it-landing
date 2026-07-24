import "server-only";

/**
 * Discord 웹훅 알림. 봇 계정·별도 라이브러리 없이 웹훅 URL로 embed를 POST한다.
 * 부정 접근 로그(`logAbuseAttempt`)와 같은 원칙 — 부가 기능이므로 어떤 경우에도
 * throw하지 않고, 웹훅 URL 미설정이면 조용히 생략한다.
 */

/** Discord embed field value 하드 리밋(1024자). */
const FIELD_MAX_LENGTH = 1024;

type DiscordField = { name: string; value: string; inline?: boolean };

const field = (name: string, value: string, inline = false): DiscordField => ({
  name,
  value:
    value.length > FIELD_MAX_LENGTH
      ? `${value.slice(0, FIELD_MAX_LENGTH - 1)}…`
      : value || "-",
  inline,
});

async function postWebhook(
  url: string,
  embed: { title: string; color: number; fields: DiscordField[] },
): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{ ...embed, timestamp: new Date().toISOString() }],
    }),
  });
  if (!response.ok) {
    throw new Error(`Discord webhook 응답 ${response.status}`);
  }
}

/** 지원서 제출 알림. 채널에는 이름·부서만 보낸다 — 연락처 등 나머지 PII는 Notion에서 본다. */
export async function notifySubmissionToDiscord(submission: {
  name: string;
  departmentLabel: string;
}): Promise<void> {
  try {
    const url = process.env.DISCORD_SUBMIT_WEBHOOK_URL;
    if (!url) return;

    await postWebhook(url, {
      title: "📝 새 지원서가 제출됐어요",
      color: 0x5865f2,
      fields: [
        field("이름", submission.name, true),
        field("지원 부서", submission.departmentLabel, true),
      ],
    });
  } catch (error) {
    console.error("Discord 제출 알림 실패:", error);
  }
}

/** Notion API 실패 알림. 부정 접근과 같은 에러 채널로 보낸다. 에러 메시지만 전송한다 — 스택·지원자 입력값에는 PII가 섞일 수 있다. */
export async function notifyNotionFailureToDiscord(entry: {
  endpoint: "submit" | "notify";
  error: unknown;
}): Promise<void> {
  try {
    const url = process.env.DISCORD_ABUSE_WEBHOOK_URL;
    if (!url) return;

    const message =
      entry.error instanceof Error ? entry.error.message : String(entry.error);
    await postWebhook(url, {
      title: "🔥 Notion API 요청이 실패했어요",
      color: 0xfaa61a,
      fields: [
        field("엔드포인트", entry.endpoint, true),
        field("에러", message),
      ],
    });
  } catch (error) {
    console.error("Discord Notion 실패 알림 실패:", error);
  }
}

/** 부정 접근 시도 알림. `logAbuseAttempt`의 IP당 레이트리밋을 통과한 건만 여기로 온다. */
export async function notifyAbuseToDiscord(entry: {
  reason: string;
  endpoint: string;
  ip: string;
  userAgent: string;
  detail?: string;
}): Promise<void> {
  try {
    const url = process.env.DISCORD_ABUSE_WEBHOOK_URL;
    if (!url) return;

    await postWebhook(url, {
      title: "🚨 부정 접근 시도가 감지됐어요",
      color: 0xed4245,
      fields: [
        field("사유", entry.reason, true),
        field("엔드포인트", entry.endpoint, true),
        field("IP", entry.ip, true),
        field("User-Agent", entry.userAgent),
        ...(entry.detail ? [field("상세", entry.detail)] : []),
      ],
    });
  } catch (error) {
    console.error("Discord 부정 접근 알림 실패:", error);
  }
}
