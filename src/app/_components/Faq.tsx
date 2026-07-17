import Image from "next/image";
import chevronBlackIcon from "../../assets/icons/chevron_black.svg";
import { Accordion, AccordionItem } from "../../common/Accordion";

// TODO: FAQ 답변은 정확한 내용으로 교체 필요
const FAQ_ITEMS = [
  {
    question: "Q1. 활동기간은 얼마나 되나요?",
    answer: "최소 2학기 이상 활동이 원칙입니다.",
  },
  {
    question: "Q2. 휴학생도 지원 가능한가요?",
    answer: "숭실대학교 학생이라면 누구나 지원 가능합니다!",
  },
  {
    question: "Q3. 코딩테스트를 따로 진행하나요?",
    answer:
      "코딩테스트는 따로 진행하지 않으나, 개발 파트 분야 면접 시 기술 관련 질문이 진행될 수 있습니다.",
  },
  {
    question: "Q4. 부서 이동이 가능한가요?",
    answer:
      "부서 이동은 불가하나, 희망자에 한해 담당 업무 외 다른 파트 작업에 참가할 수 있도록 도와드릴 예정입니다!",
  },
  {
    question: "Q5. 참가 TF 변경이 가능한가요?",
    answer:
      "초기 모집 TO에 맞춰 신입위원을 모집한 뒤, TO 업무를 진행하다, 희망 직무에 맞춰 TF 이동을 자유롭게 할 수 있습니다!",
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
                <Image
                  src={chevronBlackIcon}
                  alt=""
                  width={40}
                  height={40}
                  className="shrink-0 transition-transform duration-300 ease-in-out group-aria-expanded:rotate-180"
                />
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
