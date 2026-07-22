import { departments } from "../../../data/recruitingDepartments";
import { gradeLevels, gradeSemesters } from "../../../data/recruitingGrades";
import type { FieldConfig } from "../_lib/schema";

export const stepOneFields: FieldConfig[] = [
  {
    type: "consent",
    key: "agree",
    unnumbered: true,
    heading:
      "[IT지원위원회 4기 신입위원으로 지원함에 따른 개인정보이용동의 안내]",
    body: (
      <>
        <p>
          본인은 IT지원위원회에 지원서를 제출함에 따라 [개인정보 보호법] 제15조
          및 제17조에 따라 아래의 내용으로 개인정보를 수집, 이용 및 제공하는 데
          동의합니다.
        </p>
        <p className="mt-6 font-medium">개인정보의 수집 및 이용에 관한 사항</p>
        <p>
          - 수집하는 개인정보 항목 (이력서 양식 내용 일체) : 이름, 학번,
          전화번호 등과 그 外 지원서 기재 내용 일체
        </p>
        <p>
          - 개인정보의 이용 목적 : 수집된 개인정보를 IT지원위원회 신입 위원 서류
          심사 및 인사 서류로 활용하며, 목적 외의 용도로는 사용하지 않습니다.
        </p>
        <p className="mt-6 font-medium">개인정보의 보관 및 이용 기간</p>
        <p>
          - 귀하의 개인정보를 다음과 같이 보관하며, 수집, 이용 및 제공 목적이
          달성된 경우 [개인정보 보호법] 제21조에 따라 처리합니다.
        </p>
      </>
    ),
    checkboxLabel: "위 내용에 동의합니다.",
  },
  {
    type: "radio-group",
    key: "department",
    name: "department",
    title: "지원파트를 선택해주세요.",
    // Frontend는 이번 기수 미채용이라 선택할 수 없게 막아둔다.
    options: departments.map((d) => ({
      id: d.id,
      label: d.id === "Frontend" ? `${d.label} (이번 기수 미모집)` : d.label,
      disabled: d.id === "Frontend",
    })),
  },
  {
    type: "text",
    key: "name",
    title: "이름을 작성해주세요.",
    placeholder: "김숭실",
  },
  {
    type: "text",
    key: "studentId",
    title: "학번을 작성해주세요.",
    placeholder: "20240000",
  },
  {
    type: "text",
    key: "phone",
    title: "전화번호를 작성해주세요.",
    placeholder: "010-1234-5678",
  },
  {
    type: "text",
    key: "college",
    title: "소속 단과대학을 적어주세요.",
    placeholder: "사회과학대학",
  },
  {
    type: "text",
    key: "major",
    title: "소속 학과(부)를 작성해주세요.",
    placeholder: "글로벌미디어학부 혹은 법학과",
  },
  {
    type: "radio-matrix",
    key: "grade",
    name: "grade",
    title: "학년을 선택해주세요.",
    columns: gradeSemesters,
    rows: gradeLevels.map((level) => ({ id: level, label: level })),
    cellValue: (row, columnIndex) => `${row.id}-${gradeSemesters[columnIndex]}`,
    cellAriaLabel: (row, columnIndex) =>
      `${row.id} ${gradeSemesters[columnIndex]}`,
  },
];
