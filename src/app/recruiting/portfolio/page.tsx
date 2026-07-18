"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FileUpload, Textfield } from "../_components/fields";
import {
  FieldError,
  QuestionList,
  QuestionSection,
} from "../_components/question";
import { StepIndicator } from "../_components/StepIndicator";
import { RECRUITING_STEPS, RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/useFormState";
import { type StepThreeFormData, stepThreeSchema } from "./schema";

const initialValues: StepThreeFormData = {
  portfolioLink: "",
  portfolioFile: null,
};

export default function RecruitingStepThreePage() {
  const router = useRouter();
  const { values, setField, errors, submitted, fieldError, validate } =
    useFormState(
      () => stepThreeSchema,
      initialValues,
      RECRUITING_STORAGE_KEYS.stepThree,
    );
  const [file, setFile] = useState<File | null>(null);

  const handlePrev = () => router.push("/recruiting/motivation");

  const handleFileChange = (next: File | null) => {
    setFile(next);
    setField(
      "portfolioFile",
      next ? { name: next.name, size: next.size } : null,
    );
  };

  const handleComplete = () => {
    if (validate().success) {
      router.push("/recruiting/complete");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12 lg:px-32 xl:px-40">
      <StepIndicator steps={RECRUITING_STEPS} currentStep={3} />

      <h1 className="font-semibold text-2xl text-black md:text-[1.875rem]">
        3. 포트폴리오 제출 및 완료
      </h1>

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

      <div className="flex items-center justify-between gap-4">
        <Button icon="prev" onClick={handlePrev}>
          이전
        </Button>
        <Button onClick={handleComplete}>완료</Button>
      </div>
    </main>
  );
}
