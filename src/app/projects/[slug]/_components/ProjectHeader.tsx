type ProjectHeaderProps = {
  title: string;
  subtitle?: string;
};

export const ProjectHeader = ({ title, subtitle }: ProjectHeaderProps) => {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-2 sm:gap-3 min-[1440px]:max-w-[73.75rem]">
      <h1 className="font-semibold text-4xl text-white sm:text-5xl lg:text-5xl min-[1440px]:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="font-medium text-lg text-[#d3d3d3] sm:text-2xl lg:text-2xl min-[1440px]:text-[2.125rem]">
          {subtitle}
        </p>
      )}
    </div>
  );
};
