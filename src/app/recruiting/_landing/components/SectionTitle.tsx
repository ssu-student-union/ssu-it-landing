import Image from "next/image";
import type { ReactNode } from "react";
import cursorIcon from "../../../../assets/icons/cursor.svg";
import { Heading } from "../../../../common/Heading";

type SectionTitleProps = {
  children: ReactNode;
  /** 모집 개요~모집 일정 섹션에서만 제목 왼쪽에 장식 아이콘을 붙인다. */
  icon?: boolean;
};

/** 랜딩 섹션 헤더(h2). 리크루팅 폼 제목과 같은 `Heading` 타이포를 공유한다. */
export const SectionTitle = ({ children, icon }: SectionTitleProps) => (
  <Heading as="h2" className="flex items-center gap-2 sm:gap-3">
    {icon && <Image src={cursorIcon} alt="" className="h-auto w-3 sm:w-3.5" />}
    {children}
  </Heading>
);
