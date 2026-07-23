/**
 * 배럴 파일 — Notion 연동의 공개 API는 `submitRecruitingApplication`과
 * `subscribeRecruitingNotify` 둘뿐이다. `import "server-only"`가 있어
 * 클라이언트 컴포넌트가 이 배럴을 import하면 빌드 타임에 즉시 에러가 난다.
 * `src/app/api/recruiting/submit/route.ts`, `src/app/api/recruiting/notify/route.ts`
 * 외의 곳에서는 import하지 않는다.
 */
import "server-only";

export { submitRecruitingApplication } from "./submitApplication";
export { subscribeRecruitingNotify } from "./subscribeNotify";
