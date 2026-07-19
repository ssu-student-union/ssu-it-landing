type ProjectProgressProps = {
  progressStatus: string[];
};

export const ProjectProgress = ({ progressStatus }: ProjectProgressProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.25rem] bg-[rgba(208,234,255,0.1)] p-6 sm:gap-5 sm:p-8 lg:p-10">
      <h2 className="font-bold text-xl text-white sm:text-2xl lg:text-2xl min-[1440px]:text-[1.75rem]">
        진행 현황
      </h2>
      <div className="flex flex-col gap-2 sm:gap-3">
        {progressStatus.map((status) => (
          <p
            key={status}
            className="text-sm text-white sm:text-base lg:text-base min-[1440px]:text-lg"
          >
            {status}
          </p>
        ))}
      </div>
    </div>
  );
};
