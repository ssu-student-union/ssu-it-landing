import type { FuturePlanItem } from "../../../../data/projects";

type ProjectFuturePlansProps = {
  futurePlans: FuturePlanItem[];
};

export const ProjectFuturePlans = ({
  futurePlans,
}: ProjectFuturePlansProps) => {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-4 rounded-[1.25rem] border border-[#cdc4c4] p-6 sm:gap-5 sm:p-8 lg:p-10">
      <h2 className="font-bold text-xl text-white sm:text-2xl lg:text-2xl min-[1440px]:text-[1.75rem]">
        향후 계획
      </h2>
      <ul className="flex flex-col gap-2 sm:gap-3">
        {futurePlans.map((plan) => (
          <li key={plan.label}>
            <p className="whitespace-pre-line text-base text-white sm:text-lg lg:text-lg min-[1440px]:text-xl">
              • {plan.label}
            </p>
            {plan.subItems && (
              <ul className="mt-1 flex flex-col gap-1 pl-5">
                {plan.subItems.map((subItem) => (
                  <li
                    key={subItem}
                    className="whitespace-pre-line text-[#cccccc] text-sm sm:text-base lg:text-base min-[1440px]:text-lg"
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
