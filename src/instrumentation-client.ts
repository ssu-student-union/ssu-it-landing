import { initBotId } from "botid/client/core";

/**
 * Vercel BotID 클라이언트 초기화. 여기 등록된 경로로 나가는 요청에 봇 판별
 * 시그널이 자동으로 첨부되고, 서버 라우트의 `checkBotId()`가 이를 검증한다.
 * 보호 경로를 추가하면 해당 라우트 핸들러에도 `checkBotId()`를 넣어야 한다.
 */
initBotId({
  protect: [
    { path: "/api/recruiting/submit", method: "POST" },
    { path: "/api/recruiting/notify", method: "POST" },
  ],
});
