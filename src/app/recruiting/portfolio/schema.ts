import { z } from "zod";
import { formatFileSize } from "../_lib/ui";
import { MAX_FILE_SIZE } from "./constants";

// url은 optional — 클라이언트 검증은 Blob 업로드 전에 실행되고, sessionStorage 복원
// 메타에도 url이 없다. "파일이 있으면 url 필수"는 submit 라우트가 서버에서만 강제한다.
const fileMeta = z
  .object({ name: z.string(), size: z.number(), url: z.url().optional() })
  .nullable()
  .refine(
    (f) => !f || f.size <= MAX_FILE_SIZE,
    `파일 크기는 ${formatFileSize(MAX_FILE_SIZE)}를 초과할 수 없어요.`,
  );

export const stepThreeSchema = z
  .object({
    portfolioLink: z.string().trim().default(""),
    portfolioFile: fileMeta,
    activityCommitmentAck: z
      .boolean()
      .refine((v) => v, "IT지원위원회 활동 기간(1년 이상)을 확인해주세요."),
  })
  .superRefine((data, ctx) => {
    if (!data.portfolioLink && !data.portfolioFile) {
      ctx.addIssue({
        path: ["portfolioLink"],
        code: z.ZodIssueCode.custom,
        message: "포트폴리오 링크 또는 파일 중 하나는 필수예요.",
      });
    }
  });

export type StepThreeFormData = z.infer<typeof stepThreeSchema>;

export const stepThreeInitialValues: StepThreeFormData = {
  portfolioLink: "",
  portfolioFile: null,
  activityCommitmentAck: false,
};
