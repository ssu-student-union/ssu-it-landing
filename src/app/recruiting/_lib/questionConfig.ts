import type { ReactNode } from "react";
import { z } from "zod";

type BaseQuestion = {
  /**
   * zod 스키마 필드명이자 `QuestionSection`의 `field-${key}` id로도 그대로
   * 쓰인다. 같은 폼 안에서는 유일해야 스크롤-투-에러가 정확히 동작한다.
   */
  key: string;
  title: ReactNode;
  description?: ReactNode;
  callout?: ReactNode;
  /** 기본값 true. false면 `buildAnswerSchema`가 빈 값을 허용한다. */
  required?: boolean;
};

/**
 * 문항 하나를 표현하는 discriminated union. `QuestionRenderer`가 `type`으로
 * 분기해서 알맞은 필드 컴포넌트를 그리고, `buildAnswerSchema`가 같은 배열로
 * zod 검증 규칙을 만든다 — 이 두 곳이 항상 같은 타입 목록을 다뤄야 하므로
 * 새 문항 유형을 추가할 땐 여기 union과 두 소비처를 함께 확장해야 한다.
 */
export type QuestionConfig =
  | (BaseQuestion & { type: "checkbox-group"; options: string[] })
  | (BaseQuestion & { type: "radio-group"; options: string[] })
  | (BaseQuestion & {
      type: "textarea";
      maxLength?: number;
      rows?: number;
      placeholder?: string;
    })
  | (BaseQuestion & { type: "textfield"; placeholder?: string });

export type QuestionAnswer = string | string[];

/**
 * 문항 배열로부터 `{ [key]: zod 스키마 }` 형태의 shape을 만든다. 부서별로
 * 문항 구성이 다른 Step2에서, 선택된 부서의 `questions`만 넘겨 그 부서
 * 전용 zod object를 즉석에서 조립하는 용도로 쓴다(`motivation/schema.ts`의
 * `buildStepTwoSchema` 참고).
 */
export function buildAnswerSchema(questions: QuestionConfig[]) {
  const shape = Object.fromEntries(
    questions.map((q) => {
      const required = q.required ?? true;

      if (q.type === "checkbox-group") {
        const arr = z.array(z.string());
        return [q.key, required ? arr.min(1, "항목을 선택해주세요.") : arr];
      }

      if (q.type === "radio-group") {
        const str = z.string();
        return [q.key, required ? str.min(1, "선택해주세요.") : str];
      }

      let str = z.string().trim();
      if (required) str = str.min(1, "내용을 입력해주세요.");
      if (q.type === "textarea" && q.maxLength) {
        str = str.max(q.maxLength, `${q.maxLength}자를 초과했어요.`);
      }
      return [q.key, str];
    }),
  );

  return z.object(shape);
}

/**
 * 문항 배열로부터 `{ [key]: 빈 값 }`을 만든다. Step2에서 부서를 바꿔
 * 답변을 통째로 리셋할 때, `tasks` 같은 배열 필드를 그냥 지워서
 * `undefined`로 남기면 zod가 커스텀 메시지(`.min(1, "...")`) 대신
 * 타입 자체가 틀렸다는 기본 메시지("Invalid input: expected array...")를
 * 내보낸다 — 그걸 막기 위해 타입에 맞는 빈 값(체크박스는 `[]`, 나머지는
 * `""`)으로 채워서 리셋해야 한다.
 */
export function buildEmptyAnswers(
  questions: QuestionConfig[],
): Record<string, QuestionAnswer> {
  return Object.fromEntries(
    questions.map((q) => [q.key, q.type === "checkbox-group" ? [] : ""]),
  );
}
