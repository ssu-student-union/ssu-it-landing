import type { ReactNode } from "react";
import { Heading } from "../../../../common/Heading";

/** 랜딩 섹션 헤더(h2). 리크루팅 폼 제목과 같은 `Heading` 타이포를 공유한다. */
export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2">{children}</Heading>
);
