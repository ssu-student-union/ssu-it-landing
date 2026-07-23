import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeRecruitingNotify } from "../../../../server/notion";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  try {
    await subscribeRecruitingNotify(parsed.data.email);
  } catch (error) {
    console.error("알림 신청 실패:", error);
    return NextResponse.json(
      { ok: false, error: "notion_unavailable" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
