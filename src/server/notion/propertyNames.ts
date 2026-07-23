/**
 * Notion 데이터베이스 프로퍼티 이름. 앱 코드(`mapPayloadToProperties.ts`)와
 * 셋업 스크립트(`scripts/create-notion-database.ts`)가 같은 이름을 쓰도록
 * 여기서만 관리한다.
 *
 * 비밀 값이 없는 순수 데이터라 `server-only`로 보호하지 않는다 — 셋업
 * 스크립트는 일반 Node로 실행되는 개발 도구라 `server-only` 배럴(`index.ts`)을
 * 거치면 (Next.js 번들러 밖이라 "react-server" 조건이 적용되지 않아) 항상
 * throw하므로, 이 파일은 배럴을 거치지 않고 두 곳에서 직접 import한다.
 */
export const NOTION_PROPERTIES = {
  name: "이름",
  studentId: "학번",
  phone: "전화번호",
  college: "단과대학",
  major: "학과(전공)",
  gradeSemester: "학년/학기",
  consent: "개인정보 동의",
  interviewDates: "면접 가능 날짜",
  interviewSchedule: "면접 가능 일정",
  needsAlternateTime: "대체 일정 필요",
  recruitingDepartment: "지원 부서",
  tasks: "희망 Task",
  motivation: "지원 동기",
  fitReason: "인재상 부합 이유",
  skillAnswer: "역량 서술",
  portfolioLink: "포트폴리오 링크",
  portfolioFile: "포트폴리오 파일",
  activityCommitmentAck: "활동 기간 필수 인지",
  /** Notion이 자동 관리하는 created_time 프로퍼티. 앱 코드에서는 값을 쓰지 않는다. */
  submittedAt: "제출 일시",
} as const;

/** 마감 화면 "알림 신청하기" 이메일을 저장하는 별도 Notion 데이터베이스 프로퍼티. */
export const NOTIFY_PROPERTIES = {
  email: "이메일",
  /** Notion이 자동 관리하는 created_time 프로퍼티. 앱 코드에서는 값을 쓰지 않는다. */
  submittedAt: "제출 일시",
} as const;
