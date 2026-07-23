import { NextResponse } from "next/server";
import { isApplicationActive } from "../../../../data/recruitingSchedule";
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
  if (!isApplicationActive()) {
    return NextResponse.json(
      { ok: false, error: "application_closed" },
      { status: 403 },
    );
  }

  const formData = await request.formData();

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  if (!isSubmissionShape(payload)) {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  const fileEntry = formData.get("file");
  const file =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : undefined;

  if (file && file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { ok: false, error: "file_too_large" },
      { status: 400 },
    );
  }

  const result = validateSubmission(payload);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", fieldErrors: result.errors },
      { status: 400 },
    );
  }

  try {
    await submitRecruitingApplication(result.data, file);
  } catch (error) {
    console.error("Notion 제출 실패:", error);
    return NextResponse.json(
      { ok: false, error: "notion_unavailable" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
