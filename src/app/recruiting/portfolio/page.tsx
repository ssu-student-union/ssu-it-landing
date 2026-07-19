"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, FileUpload, Textfield } from "../_components/fields";
import {
  FieldError,
  QuestionList,
  QuestionSection,
} from "../_components/question";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { type StepThreeFormData, stepThreeSchema } from "./schema";

const initialValues: StepThreeFormData = {
  portfolioLink: "",
  portfolioFile: null,
};

async function submitApplication(formData: FormData): Promise<void> {
  let response: Response;
  try {
    // FormData를 body로 전달하면 boundary가 포함된 multipart/form-data
    // Content-Type을 브라우저가 자동으로 설정한다. 직접 헤더를 지정하면
    // boundary가 누락되어 서버에서 파싱이 실패하므로 지정하지 않는다.
    response = await fetch("/api/recruiting/submit", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // 응답 자체가 없는 경우(네트워크 단절·타임아웃)만 여기로 온다.
    throw new Error("네트워크 연결을 확인해주세요.");
  }
  if (!response.ok) throw new Error("제출에 실패했어요.");
}

export default function RecruitingStepThreePage() {
  const router = useRouter();
  const { values, setField, errors, submitted, fieldError, validate } =
    useFormState(
      () => stepThreeSchema,
      initialValues,
      RECRUITING_STORAGE_KEYS.stepThree,
    );
  const [file, setFile] = useState<File | null>(null);

  // 실제 File 객체는 리마운트("이전"으로 갔다 돌아오기)를 넘어 복원될 수
  // 없는데, sessionStorage에서 복원된 메타(`values.portfolioFile`)만 남으면
  // 파일 없이도 검증을 통과해 실제 파일 없는 제출이 가능해진다. 마운트
  // 시점에 메타를 무효화해 파일 상태와 항상 일치시킨다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행해야 한다
  useEffect(() => {
    setField("portfolioFile", null);
  }, []);

  const submitMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => router.push("/recruiting/complete"),
  });

  const handlePrev = () => router.push("/recruiting/motivation");

  const handleFileChange = (next: File | null) => {
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
        },
      }),
    );
    if (file) formData.set("file", file);
    return formData;
  };

  const handleComplete = () => {
    if (validate().success) {
      submitMutation.mutate(buildFormData());
    }
  };

  return (
    <StepLayout currentStep={3} title="3. 포트폴리오 제출 및 완료">
      <QuestionList>
        <QuestionSection
          id="field-portfolioLink"
          title="포트폴리오 (링크)"
          description="ex) Github, Notion, LinkedIn 등 링크 또는 파일을 공유해주세요."
        >
          <Textfield
            value={values.portfolioLink}
            onChange={(v) => setField("portfolioLink", v)}
            placeholder="https://..."
            error={errors.portfolioLink?.[0]}
            submitted={submitted}
          />
        </QuestionSection>

        <QuestionSection
          id="field-portfolioFile"
          title="포트폴리오 (파일)"
          description="지원되는 파일 1개를 업로드하세요. 최대 크기는 10 MB입니다."
        >
          <FileUpload
            file={file}
            onChange={handleFileChange}
            error={Boolean(fieldError("portfolioFile"))}
          />
          <div className="mt-2">
            <FieldError message={fieldError("portfolioFile")} />
          </div>
        </QuestionSection>
      </QuestionList>

      {submitMutation.isError && (
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
      )}

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
