type ProjectProgressProps = {
  progressStatus: string[];
};

export const ProjectProgress = ({ progressStatus }: ProjectProgressProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.25rem] bg-[rgba(208,234,255,0.1)] p-6 sm:gap-5 sm:p-8 lg:p-10 1440:p-16">
      <h2 className="inline-block self-start border-[#ffeeee] border-b pb-1.5 font-bold text-xl text-white sm:text-2xl lg:text-2xl 1440:text-[2.625rem]">
        진행 현황
      </h2>
      <div className="flex flex-col gap-5 sm:gap-6">
        {progressStatus.map((status) => (
          <div key={status} className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d0eaff] sm:mt-2.5" />
            <p className="whitespace-pre-line text-base text-white leading-[1.5] sm:text-lg lg:text-lg 1440:text-[1.875rem] 1440:leading-[3.4375rem]">
              {status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
