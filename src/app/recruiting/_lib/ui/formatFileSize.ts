/** 바이트를 "10MB"/"2.3MB" 형태로 보여준다(파일 업로드의 크기 제한 표시용). */
export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  const rounded = Math.round(mb * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}MB`;
}
