import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { departments } from "../../../../data/recruitingDepartments";
import { isApplicationActive } from "../../../../data/recruitingSchedule";
import { logAbuseAttempt } from "../../../../server/abuseLog";
import {
  BlobFetchError,
  deletePortfolioBlob,
  fetchPortfolioBlob,
  isAllowedBlobUrl,
} from "../../../../server/blob";
import {
  notifyNotionFailureToDiscord,
  notifySubmissionToDiscord,
} from "../../../../server/discord";
import { submitRecruitingApplication } from "../../../../server/notion";
import { validateSubmission } from "../../../recruiting/_lib/schema";

// Blob 다운로드(최대 20MiB) + Notion 업로드를 한 요청 안에서 처리할 시간 확보.
export const maxDuration = 60;

function isSubmissionShape(
  value: unknown,
): value is { stepOne: unknown; stepTwo: unknown; stepThree: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "stepOne" in value &&
    "stepTwo" in value &&
    "stepThree" in value
  );
}

export async function POST(request: Request) {
  const verdict = await checkBotId();
  if (verdict.isBot) {
    await logAbuseAttempt({
      reason: "bot_detected",
      endpoint: "submit",
      request,
    });
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 },
    );
  }

  if (!isApplicationActive()) {
    await logAbuseAttempt({
      reason: "application_closed",
      endpoint: "submit",
      request,
    });
    return NextResponse.json(
      { ok: false, error: "application_closed" },
      { status: 403 },
    );
  }

  const formData = await request.formData();

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    await logAbuseAttempt({
      reason: "invalid_request",
      endpoint: "submit",
      request,
      detail: "payload 필드 누락",
    });
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    await logAbuseAttempt({
      reason: "invalid_request",
      endpoint: "submit",
      request,
      detail: "payload JSON 파싱 실패",
    });
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  if (!isSubmissionShape(payload)) {
    await logAbuseAttempt({
      reason: "invalid_request",
      endpoint: "submit",
      request,
      detail: "payload 형태 불일치",
    });
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  const result = validateSubmission(payload);
  if (!result.success) {
    await logAbuseAttempt({
      reason: "validation_failed",
      endpoint: "submit",
      request,
      detail: `실패 필드: ${summarizeErrorFields(result.errors)}`,
    });
    return NextResponse.json(
      { ok: false, error: "validation_failed", fieldErrors: result.errors },
      { status: 400 },
    );
  }

  // 파일 바이트는 클라이언트가 Blob에 직접 올렸다 — 여기서는 URL 검증 후 내려받아 Notion에 넘긴다.
  const meta = result.data.stepThree.portfolioFile;
  let file: File | undefined;
  if (meta) {
    if (!meta.url || !isAllowedBlobUrl(meta.url)) {
      await logAbuseAttempt({
        reason: "invalid_request",
        endpoint: "submit",
        request,
        detail: "portfolioFile url 누락 또는 비허용 호스트",
      });
      return NextResponse.json(
        { ok: false, error: "invalid_request" },
        { status: 400 },
      );
    }

    try {
      file = await fetchPortfolioBlob({ name: meta.name, url: meta.url });
    } catch (error) {
      const tooLarge =
        error instanceof BlobFetchError && error.reason === "file_too_large";
      if (tooLarge) {
        await logAbuseAttempt({
          reason: "file_too_large",
          endpoint: "submit",
          request,
          detail: `메타 크기: ${meta.size} bytes`,
        });
      } else {
        console.error("Blob 다운로드 실패:", error);
      }
      await deletePortfolioBlob(meta.url);
      return NextResponse.json(
        { ok: false, error: tooLarge ? "file_too_large" : "blob_unavailable" },
        { status: tooLarge ? 400 : 502 },
      );
    }
  }

  try {
    await submitRecruitingApplication(result.data, file);
  } catch (error) {
    console.error("Notion 제출 실패:", error);
    await notifyNotionFailureToDiscord({ endpoint: "submit", error });
    return NextResponse.json(
      { ok: false, error: "notion_unavailable" },
      { status: 502 },
    );
  } finally {
    // 성공·실패 무관하게 blob은 이 요청에서 수명을 끝낸다(PII). 재시도는 재업로드부터 시작된다.
    if (meta?.url) await deletePortfolioBlob(meta.url);
  }

  const { name, department } = result.data.stepOne;
  await notifySubmissionToDiscord({
    name,
    departmentLabel:
      departments.find((d) => d.id === department)?.label ?? department,
  });

  return NextResponse.json({ ok: true });
}

/** 부정 접근 로그에는 실패한 필드 키만 남긴다 — 에러 메시지·입력값에는 PII가 섞일 수 있다. */
function summarizeErrorFields(errors: {
  stepOne: unknown;
  stepTwo: unknown;
  stepThree: unknown;
}): string {
  return Object.entries(errors)
    .map(([step, fieldErrors]) => {
      const keys =
        typeof fieldErrors === "object" && fieldErrors !== null
          ? Object.keys(fieldErrors)
          : [];
      return keys.length > 0 ? `${step}(${keys.join(", ")})` : "";
    })
    .filter(Boolean)
    .join(" / ");
}
