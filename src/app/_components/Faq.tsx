import { Accordion, AccordionItem } from "../../common/Accordion";

// TODO: FAQ 답변은 정확한 내용으로 교체 필요
const FAQ_ITEMS = [
  {
    question: "Q1. 활동기간은 얼마나 되나요?",
    answer:
      "한 기수의 활동 기간은 약 6개월이며, 매 학기 시작 전 리크루팅을 통해 새로운 기수를 모집합니다.",
  },
  {
    question: "Q2. 휴학생도 지원 가능한가요?",
    answer:
      "네, 휴학생도 지원 가능합니다. 다만 활동 특성상 정기적인 참여가 가능한 분을 우대합니다.",
  },
  {
    question: "Q3. 코딩테스트를 따로 진행하나요?",
    answer:
      "별도의 코딩테스트는 진행하지 않으며, 서류와 면접을 통해 직무 이해도와 협업 역량을 확인합니다.",
  },
  {
    question: "Q4. 부서 이동이 가능한가요?",
    answer:
      "기수 전환 시점에 한해 위원회 내부 협의를 통해 파트 이동이 제한적으로 가능합니다.",
  },
  {
    question: "Q5. 참가 TF 변경이 가능한가요?",
    answer:
      "프로젝트 착수 전 TF 배정 단계에서 위원의 희망을 반영하여 조율하고 있습니다.",
  },
];

export const Faq = () => {
  return (
    <section className="flex flex-col items-center gap-10 bg-[#fafafa] px-4 py-32">
      <h2 className="w-full max-w-4xl font-bold text-[#262323] text-[2rem]">
        FAQ/ 답변
      </h2>

      <Accordion className="flex w-full max-w-4xl flex-col gap-4">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.question}
            id={item.question}
            className="w-full overflow-hidden rounded-[1.875rem] bg-[#f6f6f6]"
            triggerClassName="flex h-[5.5625rem] w-full items-center justify-between px-8"
            panelClassName="px-8 pb-8 text-lg text-[#4a4a4a] leading-relaxed"
            trigger={
              <>
                <p className="font-semibold text-[#121212] text-2xl">
                  {item.question}
                </p>
                {/* 아코디언 토글 화살표 (Figma: iconamoon:arrow-up-2-light) - src/assets/icons/chevron.svg 추가 후 next/image로 교체 */}
                <div className="size-10.5 shrink-0 rotate-180 transition-transform duration-300 ease-in-out group-aria-expanded:rotate-0" />
              </>
            }
          >
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
