import Image from "next/image";
import calendarIcon from "../../../../assets/icons/calendar.svg";
import type { FuturePlanItem } from "../../../../data/projects";

type ProjectFuturePlansProps = {
  futurePlans: FuturePlanItem[];
};

export const ProjectFuturePlans = ({
  futurePlans,
}: ProjectFuturePlansProps) => {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-4 rounded-[1.25rem] border border-[#cdc4c4] p-6 sm:gap-5 sm:p-8 lg:max-w-[73.75rem] lg:p-16">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <Image
          src={calendarIcon}
          alt=""
          width={66}
          height={70}
          className="h-10 w-auto lg:h-[4.375rem]"
        />
        <h2 className="font-semibold text-xl text-white sm:text-2xl lg:text-[2.625rem]">
          향후 계획
        </h2>
      </div>
      <ul className="list-disc space-y-3 pl-5 font-medium text-base text-white leading-[1.5] marker:text-[0.65em] marker:text-[#cdc4c4] sm:space-y-4 sm:pl-6 sm:text-lg lg:space-y-3 lg:text-[2.125rem] lg:leading-[3.75rem]">
        {futurePlans.map((plan) => (
          <li key={plan.label} className="whitespace-pre-line">
            <span>{plan.label}</span>
            {plan.subItems && (
              <ul className="mt-1 flex flex-col gap-1 pl-2">
                {plan.subItems.map((subItem) => (
                  <li
                    key={subItem}
                    className="whitespace-pre-line leading-[1.5] text-base lg:text-[2.125rem]"
                  >
                    → {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
