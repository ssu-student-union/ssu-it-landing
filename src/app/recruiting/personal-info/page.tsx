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

  return (
    <StepLayout currentStep={1} title="1. 개인정보 동의 및 작성">
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
