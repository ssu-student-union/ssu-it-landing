import type { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  className?: string;
};

/** 동의 안내문·부서 상세·자격요건 등 폼 곳곳에서 쓰는 회색 정보 박스. 글자 크기는
 * 개인정보 동의 박스 기준으로 통일한다. */
export const Callout = ({ children, className }: CalloutProps) => (
  <div
    className={`rounded-xl bg-surface p-5 text-ink text-base leading-relaxed sm:p-8 sm:text-lg ${className ?? ""}`}
  >
    {children}
  </div>
);
