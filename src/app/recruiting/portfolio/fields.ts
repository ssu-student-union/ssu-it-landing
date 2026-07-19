import type { FieldConfig } from "../_lib/schema";

export const stepThreeFields: FieldConfig[] = [
  {
    type: "text",
    key: "portfolioLink",
    title: "포트폴리오 (링크)",
    description:
      "ex) Github, Notion, LinkedIn 등 링크 또는 파일을 공유해주세요.",
    placeholder: "https://...",
    required: false,
  },
  {
    type: "file",
    key: "portfolioFile",
    title: "포트폴리오 (파일)",
    description: "지원되는 파일 1개를 업로드하세요. 최대 크기는 10 MB입니다.",
  },
];
