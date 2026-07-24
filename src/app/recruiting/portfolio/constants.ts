/** 포트폴리오 파일 업로드 크기 제한(바이트). `fields.ts`(UI 표시)·`schema.ts`(클라이언트 검증)·
 * `api/recruiting/upload/route.ts`(Blob 업로드 토큰)·`server/blob.ts`(서버 재검증)가 모두
 * 참조하므로 어느 한쪽 소유가 아닌 별도 상수로 둔다. */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
