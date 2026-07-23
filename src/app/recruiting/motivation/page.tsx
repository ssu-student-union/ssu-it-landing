"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "../../../common/analytics";
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
    if (!validate().success) return;
    trackEvent("form_step_complete", { step: 2 });
    router.push("/recruiting/portfolio");
  };

  const handleAutofill = () => {
    setValues((prev) => ({
      ...prev,
      interviewAvailability: {
        "2026-08-01": ["13:00", "14:00"],
        "2026-08-02": ["13:00", "14:00"],
        "2026-08-03": ["19:00", "20:00"],
      },
      noAvailableTime: false,
      otherTime: [],
      motivation:
        "IT지원위원회 지원동기 테스트 문장입니다. 잘 설계된 협업 프로세스와 실제 사용자가 사용하는 환경에서 배우고 기여하고 싶습니다.",
      fitReason:
        "제 리소스를 파악하고 계획적으로 움직이며, 팀원들과 적극적으로 의사소통하는 태도가 IT지원위원회의 인재상과 잘 부합한다고 생각합니다.",
      // PM
      taskPriorities: {
        "student-council-site": "1",
        "club-council-site": "2",
        ssuport: "3",
        etc: "4",
      },
      priorityTaskStrategy:
        "1순위 과제 기획 전략 테스트 문장입니다. 유저의 목소리를 듣고 데이터를 분석하여 최적의 요구사항을 도출하겠습니다.",
      // HR
      processStructureExperience:
        "비효율적인 엑셀 취합 프로세스를 슬랙 봇과 자동화 스프레드시트를 이용해 해결한 경험이 있습니다.",
      stakeholderCoordinationExperience:
        "일정 차이가 있던 기획과 디자인 간 소통을 정기 회의를 만들어 중재한 경험이 있습니다.",
      // Design & Backend & others
      skillAnswer:
        "해당 분야에 최적화된 기술 스택과 풍부한 프로젝트 관련 경험이 있습니다. 적극적으로 배우고 성장하겠습니다.",
      tasks: [
        "UI/UX 디자인 유지보수",
        "IT지원위원회의 서비스 마케팅/굿즈 제작",
      ],
    }));
  };

  const requirements = departmentRequirementsFor(values.department);

  return (
    <StepLayout
      currentStep={2}
      title="2. 면접 시간 선택 및 지원동기 작성"
      onAutofill={handleAutofill}
    >
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
