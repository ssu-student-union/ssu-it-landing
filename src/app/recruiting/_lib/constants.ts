/** `StepIndicator`에 넘기는 3단계 라벨. 4개 페이지(personal-info/motivation/portfolio/complete)가 공유한다. */
export const RECRUITING_STEPS = [
  "개인정보 작성",
  "면접 시간 선택 및 지원동기",
  "포트폴리오 제출",
];

/** `useFormState`의 `storageKey`로 쓰는 sessionStorage 키. 스텝 간 뒤로가기 시에도 입력값을 보존하기 위함. */
export const RECRUITING_STORAGE_KEYS = {
  stepOne: "recruiting:step1",
  stepTwo: "recruiting:step2",
  stepThree: "recruiting:step3",
} as const;
