import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

const fileMeta = z
  .object({ name: z.string(), size: z.number() })
  .nullable()
  .refine(
    (f) => !f || f.size <= MAX_FILE_SIZE,
    "파일 크기는 10MB를 초과할 수 없어요.",
  );

export const stepThreeSchema = z
  .object({
    portfolioLink: z.string().trim().default(""),
    portfolioFile: fileMeta,
  })
  .superRefine((data, ctx) => {
    if (!data.portfolioLink && !data.portfolioFile) {
      const message = "포트폴리오 링크 또는 파일 중 하나는 필수예요.";
      ctx.addIssue({
        path: ["portfolioLink"],
        code: z.ZodIssueCode.custom,
        message,
      });
      ctx.addIssue({
        path: ["portfolioFile"],
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

export type StepThreeFormData = z.infer<typeof stepThreeSchema>;

export const stepThreeInitialValues: StepThreeFormData = {
  portfolioLink: "",
  portfolioFile: null,
};
