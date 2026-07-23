import type { DepartmentId } from "../../../../data/recruitingDepartments";
import type { FieldConfig } from "../../_lib/schema";
import { backendFields } from "./backend";
import { designFields } from "./design";
import { frontendFields } from "./frontend";
import { hrFields } from "./hr";
import { pmFields } from "./pm";

export const departmentFields: Record<DepartmentId, FieldConfig[]> = {
  pm: pmFields,
  design: designFields,
  frontend: frontendFields,
  backend: backendFields,
  hr: hrFields,
};
