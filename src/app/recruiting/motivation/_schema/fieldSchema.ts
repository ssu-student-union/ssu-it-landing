import { z } from "zod";
import type { FieldConfig } from "../../_lib/schema";
import { maxLengthExceededMessage, REQUIRED_MESSAGE } from "../../_lib/schema";

/**
 * 단순 필드(checkbox-group/text/textarea) 하나를 zod 검증 항목 하나로 바꾼다.
 * 부서마다 문항 키·개수가 달라지므로(예: PM은 skillAnswer가 없고 대신
 * priorityTaskStrategy가 있음), 특정 키를 하드코딩하지 않고 그 부서가 실제로
 * 갖고 있는 문항에서 그대로 파생한다. 면접시간(checkbox-matrix)은 따로 다룬다.
 */
export function fieldSchemaEntry(
  field: FieldConfig,
): [string, z.ZodTypeAny] | undefined {
  if (field.type === "checkbox-group") {
    return [field.key, z.array(z.string()).min(1, "항목을 선택해주세요.")];
  }
  if (field.type === "text" || field.type === "textarea") {
    let str = z.string().trim().min(1, REQUIRED_MESSAGE);
    if (field.maxLength) {
      str = str.max(field.maxLength, maxLengthExceededMessage(field.maxLength));
    }
    return [field.key, str];
  }
  return undefined;
}
