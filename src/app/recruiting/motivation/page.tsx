"use client";

import { useRouter } from "next/navigation";
import {
  type DepartmentId,
  departments,
} from "../../../data/recruitingStepTwo";
import { Button, Radio } from "../_components/fields";
import {
  FieldError,
  QuestionList,
  QuestionRenderer,
  QuestionSection,
} from "../_components/question";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { buildEmptyAnswers } from "../_lib/schema";
import { buildStepTwoSchema, type StepTwoFormData } from "./schema";

const initialValues: StepTwoFormData = {
  department: "",
};

export default function RecruitingStepTwoPage() {
  const router = useRouter();
  const {
    values,
    setField,
    setValues,
    errors,
    submitted,
    fieldError,
    validate,
  } = useFormState(
    (v) => buildStepTwoSchema(v.department as DepartmentId | ""),
    initialValues,
    RECRUITING_STORAGE_KEYS.stepTwo,
  );

  const selectedDepartment = departments.find(
    (d) => d.id === values.department,
  );

  const handlePrev = () => router.push("/recruiting/personal-info");

  const handleNext = () => {
    if (validate().success) {
      router.push("/recruiting/portfolio");
    }
  };

  return (
    <StepLayout currentStep={2} title="2. 지원 파트 및 지원동기 작성">
      <QuestionList>
        <QuestionSection id="field-department" title="지원부서를 선택해주세요.">
          <div className="flex flex-col gap-3">
            {departments.map((dept) => (
              <Radio
                key={dept.id}
                name="department"
                label={dept.label}
                checked={values.department === dept.id}
                error={Boolean(fieldError("department"))}
                onChange={() =>
                  setValues({
                    department: dept.id,
                    ...buildEmptyAnswers(dept.questions),
                  })
                }
              />
            ))}
          </div>
          <div className="mt-2">
            <FieldError message={fieldError("department")} />
          </div>
          <div
            className={`grid overflow-hidden transition-all duration-300 ease-expo-out ${
              selectedDepartment
                ? "grid-rows-[1fr] mt-8 opacity-100"
                : "grid-rows-[0fr] mt-0 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-xl bg-surface p-5 text-base leading-relaxed sm:p-8 sm:text-2xl">
              {selectedDepartment?.requirements}
            </div>
          </div>
        </QuestionSection>

        {selectedDepartment?.questions.map((question) => (
          <QuestionRenderer
            key={question.key}
            question={question}
            value={values[question.key]}
            onChange={(v) => setField(question.key, v)}
            error={errors[question.key]?.[0]}
            submitted={submitted}
          />
        ))}
      </QuestionList>

      <div className="flex items-center justify-between gap-4">
        <Button icon="prev" onClick={handlePrev}>
          이전
        </Button>
        <Button icon="next" onClick={handleNext}>
          다음
        </Button>
      </div>
    </StepLayout>
  );
}
