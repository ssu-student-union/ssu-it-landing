import type { FieldConfig } from "../_lib/schema";
import { formatFileSize } from "../_lib/ui";
import { MAX_FILE_SIZE } from "./constants";

export const stepThreeFields: FieldConfig[] = [
  {
    type: "text",
    key: "portfolioLink",
    title: "포트폴리오 링크",
    description:
      "Github, Notion, LinkedIn 등 포트폴리오 링크를 입력해주세요. 다음 문항의 파일 업로드로 대체할 수 있어요.",
    placeholder: "https://...",
  },
  {
    type: "file",
    key: "portfolioFile",
    title: "포트폴리오 파일",
    description: `포트폴리오 파일을 업로드해주세요. 위 링크를 입력했다면 생략할 수 있어요. 파일은 최대 ${formatFileSize(MAX_FILE_SIZE)}까지 업로드할 수 있어요.`,
    maxSize: MAX_FILE_SIZE,
    sharedErrorKey: "portfolioLink",
  },
];
