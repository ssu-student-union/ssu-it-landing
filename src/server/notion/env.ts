import "server-only";

export function getNotionEnv(): {
  NOTION_API_KEY: string;
  NOTION_DATABASE_ID: string;
} {
  const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    const missing = [
      !NOTION_API_KEY && "NOTION_API_KEY",
      !NOTION_DATABASE_ID && "NOTION_DATABASE_ID",
    ].filter((key): key is string => Boolean(key));
    throw new Error(
      `Notion 연동에 필요한 환경 변수가 없습니다: ${missing.join(", ")}. .env.example을 참고해 .env.local에 설정해주세요.`,
    );
  }
  return { NOTION_API_KEY, NOTION_DATABASE_ID };
}
