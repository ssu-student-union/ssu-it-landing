import type { ReactNode } from "react";

type CalloutProps = {
  /** 굵게 강조되는 첫 줄. 지정하면 children은 그 아래 본문으로 간격을 두고 배치된다. */
  heading?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** 동의 안내문·부서 상세·자격요건·문의 안내 등 폼·랜딩 곳곳에서 쓰는 회색 정보 박스.
 * 글자 크기는 개인정보 동의 박스 기준으로 통일한다. */
export const Callout = ({ heading, children, className }: CalloutProps) => (
  <div
    className={`rounded-xl bg-surface p-5 text-ink text-base leading-relaxed sm:p-8 sm:text-lg ${className ?? ""}`}
  >
    {heading && <p className="font-semibold">{heading}</p>}
    {heading ? (
      <div className="mt-4 flex flex-col gap-1">{children}</div>
    ) : (
      children
    )}
  </div>
);
