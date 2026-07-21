import type { DepartmentId } from "../../../../data/recruitingDepartments";
import type { FieldConfig } from "../../_lib/schema";
import { backendFields } from "./backend";
import { designFields } from "./design";
import { frontendFields } from "./frontend";
import { hrFields } from "./hr";
import { pmFields } from "./pm";

export const departmentFields: Record<DepartmentId, FieldConfig[]> = {
  PM: pmFields,
  Design: designFields,
  Frontend: frontendFields,
  Backend: backendFields,
  HR: hrFields,
};
