import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { isApplicationActive } from "../../../../data/recruitingSchedule";
import { MAX_FILE_SIZE } from "../../../recruiting/portfolio/constants";

/**
 * Vercel Blob 클라이언트 업로드용 토큰 발급 라우트. 파일 바이트는 클라이언트가
 * Blob에 직접 올리므로 서버리스 요청 본문 한도(~4.5MB)에 걸리지 않는다.
 */
export async function POST(request: Request) {
  const verdict = await checkBotId();
  if (verdict.isBot) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (!isApplicationActive()) {
    // 클라이언트는 upload()가 던진 에러 메시지에 담긴 이 문자열로 마감 여부를 감지한다.
    return NextResponse.json({ error: "application_closed" }, { status: 403 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("portfolio/")) {
          throw new Error("invalid_pathname");
        }
        return {
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
        };
      },
      // localhost에서는 호출되지 않으므로 어떤 로직도 여기에 의존시키지 않는다.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload token generation error:", error);
    return NextResponse.json(
      {
        error: "upload_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 },
    );
  }
}
