"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "../../../common/analytics";
import { Button } from "../../../common/Button";
import { FormRenderer } from "../_components/form";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { stepThreeFields } from "./fields";
import { stepThreeInitialValues, stepThreeSchema } from "./schema";

async function submitApplication(formData: FormData): Promise<void> {
  let response: Response;
  try {
    // Content-Type을 직접 지정하면 multipart boundary가 빠져 서버 파싱이 실패하므로 지정하지 않는다.
    response = await fetch("/api/recruiting/submit", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("네트워크 연결을 확인해주세요.");
  }
  if (response.status === 403) throw new Error("APPLICATION_CLOSED");
  if (!response.ok) throw new Error("제출에 실패했어요.");
}

export default function RecruitingStepThreePage() {
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
    () => stepThreeSchema,
    stepThreeInitialValues,
    RECRUITING_STORAGE_KEYS.stepThree,
  );
  const [file, setFile] = useState<File | null>(null);

  // File 객체는 리마운트를 넘어 복원되지 않는데, sessionStorage의 메타만 남으면
  // 파일 없이도 검증을 통과한다 — 마운트 시 메타를 무효화해 상태를 맞춘다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행해야 한다
  useEffect(() => {
    setField("portfolioFile", null);
  }, []);

  const submitMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      trackEvent("form_submit_success");
      router.push("/recruiting/complete");
    },
  });

  const handlePrev = () => router.push("/recruiting/motivation");

  const handleFileChange = (_key: string, next: File | null) => {
    setFile(next);
    setField(
      "portfolioFile",
      next ? { name: next.name, size: next.size } : null,
    );
  };

  // 1·2단계는 이미 언마운트된 상태라 sessionStorage가 유일한 데이터 소스다.
  const buildFormData = (): FormData => {
    const stepOneRaw = sessionStorage.getItem(RECRUITING_STORAGE_KEYS.stepOne);
    const stepTwoRaw = sessionStorage.getItem(RECRUITING_STORAGE_KEYS.stepTwo);

    const formData = new FormData();
    formData.set(
      "payload",
      JSON.stringify({
        stepOne: stepOneRaw ? JSON.parse(stepOneRaw) : {},
        stepTwo: stepTwoRaw ? JSON.parse(stepTwoRaw) : {},
        stepThree: {
          portfolioLink: values.portfolioLink,
          portfolioFile: values.portfolioFile,
          activityCommitmentAck: values.activityCommitmentAck,
        },
      }),
    );
    if (file) formData.set("file", file);
    return formData;
  };

  const handleComplete = () => {
    if (!validate().success) return;
    trackEvent("form_step_complete", { step: 3 });
    submitMutation.mutate(buildFormData());
  };

  const handleAutofill = () => {
    setValues((prev) => ({
      ...prev,
      portfolioLink: prev.portfolioLink?.trim()
        ? prev.portfolioLink
        : "https://github.com/ssu-student-union/ssu-it-landing",
      activityCommitmentAck: prev.activityCommitmentAck || true,
    }));
  };

  return (
    <StepLayout
      currentStep={3}
      title="3. 포트폴리오 제출 및 완료"
      onAutofill={handleAutofill}
    >
      <FormRenderer
        fields={stepThreeFields}
        values={values}
        errors={errors}
        submitted={submitted}
        fieldError={fieldError}
        setValues={setValues}
        files={{ portfolioFile: file }}
        onFileChange={handleFileChange}
      />

      {submitMutation.isError &&
        (submitMutation.error.message === "APPLICATION_CLOSED" ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-600 text-sm leading-relaxed sm:text-base">
            <p>모집 기간이 종료되어 접수가 마감되었어요.</p>
            <button
              type="button"
              onClick={() => router.push("/recruiting")}
              className="mt-3 font-medium underline underline-offset-2 hover:text-red-700"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-red-50 p-5 text-red-600 text-sm leading-relaxed sm:text-base">
            <p>
              제출 중 문제가 발생했어요. 입력하신 내용은 그대로 남아있으니 다시
              시도해주세요.
            </p>
            <button
              type="button"
              onClick={() => submitMutation.mutate(buildFormData())}
              className="mt-3 font-medium underline underline-offset-2 hover:text-red-700"
            >
              다시 시도
            </button>
          </div>
        ))}

      <div className="flex items-center justify-between gap-4">
        <Button
          icon="prev"
          onClick={handlePrev}
          disabled={submitMutation.isPending}
        >
          이전
        </Button>
        <Button onClick={handleComplete} disabled={submitMutation.isPending}>
          {submitMutation.isPending ? "제출 중..." : "완료"}
        </Button>
      </div>
    </StepLayout>
  );
}
