import type { ComponentPropsWithoutRef } from "react";

/** 문항 리스트 wrapper. CSS counter를 리셋해 `QuestionSection`의 자동 번호 매기기 기준점이 되고, 문항 사이 구분선을 그린다. */
export const QuestionList = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"ol">) => (
  <ol className={`[counter-reset:question] ${className ?? ""}`} {...props} />
);
