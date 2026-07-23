"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "../../../common/analytics";
import { Button } from "../../../common/Button";
import { FormRenderer } from "../_components/form";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { stepOneFields } from "./fields";
import { stepOneInitialValues, stepOneSchema } from "./schema";

export default function RecruitingStepOnePage() {
  const router = useRouter();
  const { values, setValues, errors, submitted, fieldError, validate } =
    useFormState(
      () => stepOneSchema,
      stepOneInitialValues,
      RECRUITING_STORAGE_KEYS.stepOne,
    );

  useEffect(() => {
    trackEvent("form_start");
  }, []);

  const handleNext = () => {
    if (!validate().success) return;
    trackEvent("form_step_complete", { step: 1 });
    router.push("/recruiting/motivation");
  };

  const handleAutofill = () => {
    setValues((prev) => ({
      ...prev,
      agree: prev.agree || true,
      name: prev.name?.trim() ? prev.name : "테스터",
      studentId: prev.studentId?.trim() ? prev.studentId : "20241234",
      phone: prev.phone?.trim() ? prev.phone : "010-1234-5678",
      college: prev.college?.trim() ? prev.college : "IT대학",
      major: prev.major?.trim() ? prev.major : "소프트웨어학부",
      grade: prev.grade ? prev.grade : "2학년-2학기",
    }));
  };

  return (
    <StepLayout
      currentStep={1}
      title="1. 개인정보 동의 및 작성"
      onAutofill={handleAutofill}
    >
      <FormRenderer
        fields={stepOneFields}
        values={values}
        errors={errors}
        submitted={submitted}
        fieldError={fieldError}
        setValues={setValues}
      />
      <div className="flex items-center justify-end gap-4">
        <Button icon="next" onClick={handleNext}>
          다음
        </Button>
      </div>
    </StepLayout>
  );
}
