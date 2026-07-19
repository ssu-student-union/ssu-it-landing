/**
 * 같은 검증 규칙을 두 곳(즉시 피드백용 UI 컴포넌트, 제출 차단용 zod 스키마)
 * 에서 검사하는 경우의 에러 문구. 스키마는 서버 재검증(`validateSubmission`)
 * 에서도 쓰이므로 이 모듈은 클라이언트 의존성 없이 순수하게 유지한다.
 */
export const TIME_RANGE_ORDER_MESSAGE =
  "종료 시각은 시작 시각보다 늦어야 해요.";

export const maxLengthExceededMessage = (max: number) =>
  `${max}자를 초과했어요.`;
