import type { QuestionAnswer, QuestionConfig } from "../../_lib/questionConfig";
import { Checkbox, Radio, Textfield } from "../fields";
import { FieldError } from "./FieldError";
import { QuestionSection } from "./QuestionSection";

type QuestionRendererProps = {
  question: QuestionConfig;
  value: QuestionAnswer | undefined;
  onChange: (value: QuestionAnswer) => void;
  /** 아직 `submitted`로 게이팅되지 않은 원본 에러 메시지. */
  error?: string;
  submitted?: boolean;
};

/**
 * `QuestionConfig`(`_lib/questionConfig.ts` 참고) 하나를 받아 타입에 맞는
 * 필드 컴포넌트로 렌더링하고 `QuestionSection`으로 감싼다. 덕분에
 * `src/data/recruitingStepTwo.tsx`는 부서별 문항 구성을 JSX가 아니라
 * 순수 데이터로 정의할 수 있다 — 새 문항 타입이 필요하면 여기와
 * `QuestionConfig` union에 케이스를 추가하면 데이터만으로 쓸 수 있게 된다.
 *
 * `QuestionSection`에 항상 `animateOnMount`를 넘긴다: 이 컴포넌트가
 * 렌더링하는 문항은 전부 페이지 로드 한참 후(예: 부서 선택 시점)에야
 * 트리에 조건부로 추가되므로, mount되는 순간 자체가 "등장" 연출이어야 한다.
 */
export const QuestionRenderer = ({
  question,
  value,
  onChange,
  error,
  submitted,
}: QuestionRendererProps) => {
  const id = `field-${question.key}`;
  // Checkbox/Radio 그룹은 자체 blur 추적이 없어 `submitted` 전까지는
  // 테두리도 빨개지면 안 된다 — Textfield(아래)는 반대로 원본 `error`를
  // 그대로 받아 자기 blur 타이밍으로 스스로 게이팅한다.
  const gatedError = submitted ? error : undefined;

  if (question.type === "checkbox-group") {
    const selected = (value as string[] | undefined) ?? [];
    return (
      <QuestionSection
        id={id}
        title={question.title}
        description={question.description}
        callout={question.callout}
        animateOnMount
      >
        <div className="flex flex-col gap-3">
          {question.options.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={selected.includes(option)}
              error={Boolean(gatedError)}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? [...selected, option]
                    : selected.filter((item) => item !== option),
                )
              }
            />
          ))}
        </div>
        <div className="mt-2">
          <FieldError message={gatedError} />
        </div>
      </QuestionSection>
    );
  }

  if (question.type === "radio-group") {
    return (
      <QuestionSection
        id={id}
        title={question.title}
        description={question.description}
        callout={question.callout}
        animateOnMount
      >
        <div className="flex flex-col gap-3">
          {question.options.map((option) => (
            <Radio
              key={option}
              name={question.key}
              label={option}
              checked={value === option}
              error={Boolean(gatedError)}
              onChange={() => onChange(option)}
            />
          ))}
        </div>
        <div className="mt-2">
          <FieldError message={gatedError} />
        </div>
      </QuestionSection>
    );
  }

  return (
    <QuestionSection
      id={id}
      title={question.title}
      description={question.description}
      callout={question.callout}
      animateOnMount
    >
      <Textfield
        multiline={question.type === "textarea"}
        maxLength={
          question.type === "textarea" ? question.maxLength : undefined
        }
        rows={question.type === "textarea" ? question.rows : undefined}
        value={(value as string | undefined) ?? ""}
        onChange={onChange}
        placeholder={question.placeholder}
        error={error}
        submitted={submitted}
      />
    </QuestionSection>
  );
};
