"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../../../common/Button";
import type { DepartmentId } from "../../../data/recruitingDepartments";
import { Callout, FormRenderer } from "../_components/form";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { buildEmptyAnswers } from "../_lib/schema";
import { departmentRequirementsFor } from "./departmentRequirements";
import { questionsFor, stepTwoFields } from "./fields";
import { buildStepTwoSchema, stepTwoInitialValues } from "./schema";

export default function RecruitingStepTwoPage() {
  const router = useRouter();

  // department는 Step1의 sessionStorage에만 있어 서버 렌더에서 알 수 없다.
  // 초기값은 항상 결정적으로 두고(department: ""), 마운트 후 effect에서만 반영한다
  // — 그렇지 않으면 부서별로 다른 면접시간표 컬럼 수가 하이드레이션을 깬다.
  const { values, setValues, errors, submitted, fieldError, validate } =
    useFormState(
      (v) => buildStepTwoSchema(v.department as DepartmentId | ""),
      stepTwoInitialValues,
      RECRUITING_STORAGE_KEYS.stepTwo,
    );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 비교한다
  useEffect(() => {
    const stepOneRaw = sessionStorage.getItem(RECRUITING_STORAGE_KEYS.stepOne);
    const department = stepOneRaw
      ? ((JSON.parse(stepOneRaw).department as DepartmentId | "" | undefined) ??
        "")
      : "";

    if (!department) {
      router.replace("/recruiting/personal-info");
      return;
    }

    setValues((prev) =>
      prev.department === department
        ? prev
        : {
            ...stepTwoInitialValues,
            ...buildEmptyAnswers(questionsFor(department)),
            department,
          },
    );
  }, []);

  const handlePrev = () => router.push("/recruiting/personal-info");
  const handleNext = () => {
    if (validate().success) router.push("/recruiting/portfolio");
  };

  const requirements = departmentRequirementsFor(values.department);

  return (
    <StepLayout currentStep={2} title="2. 면접 시간 선택 및 지원동기 작성">
      {requirements && <Callout>{requirements}</Callout>}
      <FormRenderer
        fields={stepTwoFields}
        values={values}
        errors={errors}
        submitted={submitted}
        fieldError={fieldError}
        setValues={setValues}
      />
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
