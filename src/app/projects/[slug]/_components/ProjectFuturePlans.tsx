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
    <div className="flex w-full max-w-5xl flex-col gap-4 rounded-[1.25rem] border border-[#cdc4c4] p-6 sm:gap-5 sm:p-8 lg:p-10 min-[1440px]:max-w-[73.75rem] min-[1440px]:p-16">
      <div className="flex items-center gap-2 sm:gap-3 min-[1440px]:gap-4">
        <Image
          src={calendarIcon}
          alt=""
          width={66}
          height={70}
          className="h-10 w-auto min-[1440px]:h-[4.375rem]"
        />
        <h2 className="font-bold text-xl text-white sm:text-2xl lg:text-2xl min-[1440px]:text-[2.625rem]">
          향후 계획
        </h2>
      </div>
      <ul className="flex flex-col gap-3 sm:gap-4 min-[1440px]:gap-3">
        {futurePlans.map((plan) => (
          <li key={plan.label} className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#cdc4c4] sm:mt-2.5" />
              <p className="whitespace-pre-line text-base text-white leading-[1.5] sm:text-lg lg:text-lg min-[1440px]:text-[2.125rem] min-[1440px]:leading-[3.75rem]">
                {plan.label}
              </p>
            </div>
            {plan.subItems && (
              <ul className="flex flex-col gap-1 pl-[1.375rem]">
                {plan.subItems.map((subItem) => (
                  <li
                    key={subItem}
                    className="whitespace-pre-line text-[#cccccc] text-sm leading-[1.5] sm:text-base lg:text-base min-[1440px]:text-2xl"
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
