import "server-only";

import { notifyAbuseToDiscord } from "./discord";

export type AbuseReason =
  | "application_closed"
  | "invalid_request"
  | "validation_failed"
  | "file_too_large"
  | "bot_detected";

export type AbuseLogEntry = {
  reason: AbuseReason;
  endpoint: "submit" | "notify" | "upload";
  request: Request;
  /** 실패 필드 키 목록 등 요약만 넘긴다 — 원본 페이로드는 PII가 섞일 수 있어 보내지 않는다. */
  detail?: string;
};

/** 공격당해도 Discord 채널이 도배되지 않도록 IP당 분당 알림 횟수를 제한한다.
 * serverless 인스턴스별 인메모리라 완벽하진 않지만 웹훅 rate limit 보호에는 충분하다. */
const LOG_RATE_WINDOW_MS = 60_000;
const LOG_RATE_MAX_PER_WINDOW = 5;
const logCounts = new Map<string, { windowStart: number; count: number }>();

function shouldLog(ip: string, now: number): boolean {
  if (logCounts.size > 1_000) {
    for (const [key, entry] of logCounts) {
      if (now - entry.windowStart >= LOG_RATE_WINDOW_MS) logCounts.delete(key);
    }
  }

  const entry = logCounts.get(ip);
  if (!entry || now - entry.windowStart >= LOG_RATE_WINDOW_MS) {
    logCounts.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  entry.count += 1;
  return entry.count <= LOG_RATE_MAX_PER_WINDOW;
}

/** Vercel이 넣어주는 `x-forwarded-for`의 첫 값이 실제 클라이언트 IP다. */
function extractRequestMeta(request: Request): {
  ip: string;
  userAgent: string;
} {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") ?? "";
  return { ip, userAgent };
}

/**
 * 서버에서 거절된 요청(부정 접근 시도)을 Discord 웹훅으로 알린다.
 * 부가 기능이므로 어떤 경우에도 throw하지 않는다 — 웹훅 미설정이면 생략,
 * 실패는 서버 콘솔에만 남겨 사용자 응답에 영향을 주지 않는다.
 */
export async function logAbuseAttempt(entry: AbuseLogEntry): Promise<void> {
  const { ip, userAgent } = extractRequestMeta(entry.request);
  if (!shouldLog(ip, Date.now())) return;

  await notifyAbuseToDiscord({
    reason: entry.reason,
    endpoint: entry.endpoint,
    ip,
    userAgent,
    detail: entry.detail,
  });
}
