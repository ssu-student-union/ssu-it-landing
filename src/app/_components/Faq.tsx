import Image from "next/image";
import chevronBlackIcon from "../../assets/icons/chevron_black.svg";
import { Accordion, AccordionItem } from "../../common/Accordion";
import { Reveal } from "../../common/Reveal";

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
    <section className="flex flex-col items-center gap-6 bg-[#fafafa] px-4 py-16 sm:gap-8 sm:py-24 lg:gap-10 lg:py-32">
      <Reveal>
        <h2 className="w-full max-w-4xl font-bold text-[#262323] text-xl sm:text-2xl lg:text-2xl min-[1440px]:text-[2rem]">
          FAQ/ 답변
        </h2>
      </Reveal>

      <Accordion className="flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
        {FAQ_ITEMS.map((item, index) => (
          <Reveal key={item.question} delay={index * 80}>
            <AccordionItem
              id={item.question}
              className="w-full overflow-hidden rounded-2xl bg-[#f6f6f6] transition-colors duration-300 hover:bg-[#eeeeee] sm:rounded-[1.875rem]"
              triggerClassName="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 sm:min-h-20 sm:px-8 lg:h-[5.5625rem] lg:py-0"
              panelClassName="px-5 pb-5 text-base text-[#4a4a4a] leading-relaxed sm:px-8 sm:pb-8 sm:text-lg lg:text-lg min-[1440px]:text-xl"
              trigger={
                <>
                  <p className="text-left font-semibold text-[#121212] text-base sm:text-xl lg:text-xl min-[1440px]:text-2xl">
                    {item.question}
                  </p>
                  <Image
                    src={chevronBlackIcon}
                    alt=""
                    width={40}
                    height={40}
                    className="h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out group-aria-expanded:rotate-180 sm:h-8 sm:w-8 lg:h-8 lg:w-8 min-[1440px]:h-[2.625rem] min-[1440px]:w-[2.625rem]"
                  />
                </>
              }
            >
              {item.answer}
            </AccordionItem>
          </Reveal>
        ))}
      </Accordion>
    </section>
  );
};
