"use client";

import { useRouter } from "next/navigation";
import { Button } from "../_components/fields";
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

  const handleNext = () => {
    if (validate().success) router.push("/recruiting/motivation");
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
