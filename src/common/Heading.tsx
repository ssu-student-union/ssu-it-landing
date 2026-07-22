import type { ReactNode } from "react";

type HeadingProps = {
  /** 시맨틱 레벨. 폼 페이지 제목은 h1, 랜딩 섹션 제목은 h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
};

/**
 * 리크루팅 폼 페이지 제목과 랜딩 섹션 제목이 공유하는 헤딩 타이포. 톤을 한 곳에서
 * 관리해 두 플로우의 헤더가 어긋나지 않도록 한다.
 */
export const Heading = ({
  as: Tag = "h2",
  className,
  children,
}: HeadingProps) => (
  <Tag
    className={`font-semibold text-2xl text-ink md:text-[1.875rem] ${className ?? ""}`}
  >
    {children}
  </Tag>
);
