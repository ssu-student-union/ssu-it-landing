type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
  className?: string;
};

/** 상단 진행 표시. `currentStep`보다 작은 번호는 체크 완료로 표시되므로, 전 단계를 다 채운 상태로 보이려면 `steps.length + 1`을 준다. */
export const StepIndicator = ({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) => (
  <ol className={`flex flex-nowrap items-center ${className ?? ""}`}>
    {steps.map((label, i) => {
      const stepNumber = i + 1;
      const isDone = stepNumber < currentStep;
      const isCurrent = stepNumber === currentStep;
      return (
        <li key={label} className="flex items-center">
          {i > 0 && (
            <span
              className={`mx-2 h-px w-6 shrink-0 sm:mx-4 sm:w-10 md:w-15 ${
                stepNumber - 1 < currentStep ? "bg-brand" : "bg-inactive"
              }`}
            />
          )}
          <span
            className={`flex items-center gap-1.5 whitespace-nowrap font-semibold text-base sm:gap-2 sm:text-xl md:text-[1.75rem] ${
              isDone ? "text-brand" : isCurrent ? "text-ink" : "text-inactive"
            }`}
          >
            {isDone ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0 sm:h-7 sm:w-7 md:size-10.5"
              >
                <circle cx="12" cy="12" r="12" fill="var(--color-brand)" />
                <path
                  d="M7 12.5L10.5 16L17 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={`shrink-0 sm:h-7 sm:w-7 md:size-10.5 ${isCurrent ? "text-ink" : "text-inactive"}`}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 12.5L10.5 16L17 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {label}
          </span>
        </li>
      );
    })}
  </ol>
);
