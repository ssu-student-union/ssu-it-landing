import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { departments } from "../../../../data/recruitingDepartments";
import { isApplicationActive } from "../../../../data/recruitingSchedule";
import { logAbuseAttempt } from "../../../../server/abuseLog";
import {
  notifyNotionFailureToDiscord,
  notifySubmissionToDiscord,
} from "../../../../server/discord";
import { submitRecruitingApplication } from "../../../../server/notion";
import { validateSubmission } from "../../../recruiting/_lib/schema";
import { MAX_FILE_SIZE } from "../../../recruiting/portfolio/constants";

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

  const fileEntry = formData.get("file");
  const file =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : undefined;

  if (file && file.size > MAX_FILE_SIZE) {
    await logAbuseAttempt({
      reason: "file_too_large",
      endpoint: "submit",
      request,
      detail: `파일 크기: ${file.size} bytes`,
    });
    return NextResponse.json(
      { ok: false, error: "file_too_large" },
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

  try {
    await submitRecruitingApplication(result.data, file);
  } catch (error) {
    console.error("Notion 제출 실패:", error);
    await notifyNotionFailureToDiscord({ endpoint: "submit", error });
    return NextResponse.json(
      { ok: false, error: "notion_unavailable" },
      { status: 502 },
    );
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
