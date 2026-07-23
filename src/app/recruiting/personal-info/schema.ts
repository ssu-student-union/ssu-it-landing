import { z } from "zod";
import {
  type DepartmentId,
  isDepartmentId,
} from "../../../data/recruitingDepartments";

export const stepOneSchema = z.object({
  agree: z.boolean().refine((v) => v, "개인정보 수집 및 이용에 동의해주세요."),
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  studentId: z
    .string()
    .regex(/^\d{8}$/, "학번은 숫자 8자리로 입력해주세요. (예: 20240000)"),
  phone: z
    .string()
    .regex(
      /^01[0-9]-\d{3,4}-\d{4}$/,
      "전화번호 형식이 올바르지 않아요. (예: 010-1234-5678)",
    ),
  college: z.string().trim().min(1, "소속 단과대학을 입력해주세요."),
  major: z.string().trim().min(1, "소속 학과(부)를 입력해주세요."),
  grade: z.string().min(1, "학년/학기를 선택해주세요."),
  department: z
    .string()
    .refine((v) => isDepartmentId(v), "지원부서를 선택해주세요."),
});

// department는 미선택 상태("")도 폼 값으로 표현해야 해서, zod가 refine으로
// 추론한 `DepartmentId` 대신 `DepartmentId | ""`로 넓혀 쓴다.
export type StepOneFormData = Omit<
  z.infer<typeof stepOneSchema>,
  "department"
> & {
  department: DepartmentId | "";
};

export const stepOneInitialValues: StepOneFormData = {
  agree: false,
  name: "",
  studentId: "",
  phone: "",
  college: "",
  major: "",
  grade: "",
  department: "",
};
