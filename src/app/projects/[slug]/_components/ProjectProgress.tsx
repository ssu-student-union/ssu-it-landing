type ProjectProgressProps = {
  progressStatus: string[];
};

export const ProjectProgress = ({ progressStatus }: ProjectProgressProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.25rem] bg-[rgba(208,234,255,0.1)] p-6 sm:gap-5 sm:p-8 lg:p-16">
      <h2 className="inline-block self-start border-[#ffeeee] border-b pb-1.5 font-semibold text-xl text-white sm:text-2xl lg:text-[2.625rem]">
        진행 현황
      </h2>
      <ul className="list-disc space-y-5 pl-5 text-base font-medium text-white leading-[1.5] marker:text-[0.65em] marker:text-white sm:space-y-6 sm:pl-6 sm:text-lg lg:text-[1.875rem] lg:leading-[3.4375rem]">
        {progressStatus.map((status) => (
          <li key={status} className="whitespace-pre-line">
            {status}
          </li>
        ))}
      </ul>
    </div>
  );
};
