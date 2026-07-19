type ProjectDescriptionProps = {
  description: string[];
};

export const ProjectDescription = ({
  description,
}: ProjectDescriptionProps) => {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-5 rounded-[1.25rem] bg-[rgba(208,234,255,0.1)] p-6 sm:gap-6 sm:p-8 lg:p-10">
      {description.map((paragraph) => (
        <p
          key={paragraph}
          className="whitespace-pre-line font-medium text-base text-white leading-[1.7] sm:text-lg lg:text-lg min-[1440px]:text-xl"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
};
