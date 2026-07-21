import type { FieldConfig } from "../_lib/schema";
import { formatFileSize } from "../_lib/ui";
import { MAX_FILE_SIZE } from "./constants";

export const stepThreeFields: FieldConfig[] = [
  {
    type: "link-or-file",
    key: "portfolio",
    title: "포트폴리오",
    description: `Github, Notion, LinkedIn 등 링크 또는 파일로 제출해주세요. 파일은 최대 ${formatFileSize(MAX_FILE_SIZE)}까지 업로드할 수 있어요.`,
    link: { key: "portfolioLink", placeholder: "https://..." },
    file: { key: "portfolioFile", maxSize: MAX_FILE_SIZE },
  },
];
