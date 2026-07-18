import type { ReactNode } from "react";

export type Question = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  callout?: ReactNode;
};

const highlight = (text: string) => (
  <b className="font-extrabold text-[#142992]">{text}</b>
);

export const questions: Question[] = [
  {
    id: "department",
    title: "지원부서를 선택해주세요.",
    callout: (
      <>
        <p className="font-bold">자격요건</p>
        <p>
          {highlight("[Problem Solver]")} 일상 속 불편함을 그냥 지나치지 않고,
          논리적으로 원인을 파악하여 창의적인 해결책을 제시할 수 있는 분
        </p>
      </>
    ),
  },
  {
    id: "motivation",
    title: "IT지원위원회에 지원한 이유는 무엇인가요? (500자 이내)",
    description: (
      <>
        IT지원위원회에 {highlight("지원하게 된 계기")}를 구체적으로 설명
        <br />
        본인이 기대하는 {highlight("배움과 성장의 방향")} 제시
      </>
    ),
  },
];
