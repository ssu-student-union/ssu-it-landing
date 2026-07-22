import Image from "next/image";
import chevronBlackIcon from "../../../../assets/icons/chevron_black.svg";
import { Accordion, AccordionItem } from "../../../../common/Accordion";
import { FAQ_ITEMS } from "../../../_components/Faq";
import { SectionTitle } from "../components";

export const Faq = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
      <SectionTitle>FAQ / 답변</SectionTitle>
      <div className="mt-8 sm:mt-10">
        <Accordion className="flex w-full flex-col gap-3 sm:gap-4">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.question}
              id={item.question}
              className="w-full overflow-hidden rounded-2xl bg-[#f6f6f6] transition-colors duration-300 hover:bg-[#eeeeee] sm:rounded-[1.875rem]"
              triggerClassName="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 sm:min-h-20 sm:px-8 lg:h-[5.5625rem] lg:py-0"
              panelClassName="px-5 pb-5 text-base text-[#4a4a4a] leading-relaxed sm:px-8 sm:pb-8 sm:text-lg lg:text-xl"
              trigger={
                <>
                  <p className="text-left font-semibold text-[#121212] text-base sm:text-xl lg:text-2xl">
                    {item.question}
                  </p>
                  <Image
                    src={chevronBlackIcon}
                    alt=""
                    width={40}
                    height={40}
                    className="h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out group-aria-expanded:rotate-180 sm:h-8 sm:w-8 lg:h-[2.625rem] lg:w-[2.625rem]"
                  />
                </>
              }
            >
              {item.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);
