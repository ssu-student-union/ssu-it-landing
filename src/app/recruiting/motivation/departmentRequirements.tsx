import type { ReactNode } from "react";
import type { DepartmentId } from "../../../data/recruitingDepartments";

type RequirementLine = {
  /** bold로 앞에 붙는 태그. 이미 필요한 괄호/콜론까지 포함해서 넘긴다(예: "[필수]", "IT 프로젝트 리딩 경험:"). */
  label?: string;
  text: string;
  /** 한 항목 아래 딸린 세부 조건(디자인팀 Figma 조건 등). */
  subItems?: string[];
};

type RequirementSection = {
  heading?: string;
  lines: RequirementLine[];
};

function Line({ label, text, subItems }: RequirementLine) {
  return (
    <li>
      {label && <b className="text-brand">{label} </b>}
      {text}
      {subItems && (
        <ul className="mt-1 flex list-[circle] flex-col gap-1 pl-4">
          {subItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Sections({ sections }: { sections: RequirementSection[] }) {
  return (
    <div className="flex flex-col gap-5">
      {sections.map((section) => (
        <div key={section.heading ?? section.lines[0]?.text}>
          {section.heading && (
            <p className="mb-2 font-semibold text-ink">{section.heading}</p>
          )}
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            {section.lines.map((line) => (
              <Line key={line.text} {...line} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const REQUIREMENTS: Record<DepartmentId, ReactNode> = {
  PM: (
    <Sections
      sections={[
        {
          heading: "자격요건",
          lines: [
            {
              label: "[Problem Solver]",
              text: "일상 속 불편함을 그냥 지나치지 않고, 논리적으로 원인을 파악하여 창의적인 해결책을 제시할 수 있는 분",
            },
            {
              label: "[Communication]",
              text: "개발자, 디자이너, 유관부서(학생회 등)와 원활하게 소통하며, 복잡한 요구사항을 명확한 문서로 정리할 수 있는 분",
            },
            {
              label: "[Professionalism]",
              text: "학생 사회에 대한 높은 이해도를 바탕으로, 맡은 프로젝트에 대해 책임감을 갖고 데드라인을 준수할 수 있는 분",
            },
            {
              label: "[Growth]",
              text: "실패를 두려워하지 않고 회고를 통해 배움을 얻으며, 동료와 함께 성장할 준비가 된 분",
            },
          ],
        },
        {
          heading: "우대 조건",
          lines: [
            {
              label: "IT 프로젝트 리딩 경험:",
              text: "실제 앱/웹 서비스를 기획부터 배포, 운영까지 경험해 보신 분",
            },
            {
              label: "협업 툴 활용 능력:",
              text: "Git/GitHub 흐름을 이해하고 있으며, 이슈 관리 및 PR 기반의 현황 파악이 가능하신 분",
            },
            {
              label: "데이터 리터러시:",
              text: "SQL, GA, Amplitude 등을 활용해 데이터를 추출하고 인사이트를 도출해 본 경험이 있는 분",
            },
            {
              label: "학생 사회 경험:",
              text: "학생회, 동아리 임원 등 학내 조직 구조와 생리에 대한 이해가 깊은 분",
            },
          ],
        },
      ]}
    />
  ),
  Design: (
    <Sections
      sections={[
        {
          heading: "UI/UX 디자인",
          lines: [
            {
              label: "[필수]",
              text: "Figma 사용 가능자",
              subItems: [
                "Auto Layout 활용 가능자",
                "min, max-width 이용 반응형 페이지 제작 가능자",
                "서비스 디자인 유경험자",
              ],
            },
            { label: "[필수]", text: "디자인 시스템 구축 가능자" },
          ],
        },
        {
          heading: "마케팅 디자인",
          lines: [
            { label: "[필수]", text: "Figma 사용 가능자" },
            {
              label: "[우대]",
              text: "SNS 마케팅, 카드 뉴스, 내부 굿즈 제작 가능자",
            },
            { label: "[우대]", text: "AI 툴 사용 가능자" },
            { label: "[우대]", text: "3D 툴 사용 가능자" },
          ],
        },
      ]}
    />
  ),
  Frontend: (
    <Sections
      sections={[
        {
          heading: "자격요건",
          lines: [
            {
              text: "적극적으로 활동 참여가 가능하며 일주일 하루 이상의 시간을 할애할 수 있는 분",
            },
            {
              text: "기본적인 Frontend 개발 과정을 이해하고 있으며, Github를 이용한 1개 이상의 프론트/백엔드 협업 프로젝트를 경험해보신 분",
            },
          ],
        },
        {
          heading: "우대사항",
          lines: [
            {
              text: "IT지원위원회 프론트엔드 팀이 사용하는 기술스택을 기반으로 프로젝트 구현 및 유지보수를 해 본 경험이 있으신 분",
            },
            {
              text: "적극적인 코드리뷰를 통해 함께 성장하고자 하는 의지가 있으신 분",
            },
          ],
        },
      ]}
    />
  ),
  Backend: (
    <Sections
      sections={[
        {
          heading: "공통",
          lines: [
            {
              label: "[필수]",
              text: "학기 및 방학 중 책임감 있고, 적극적인 프로젝트 기여 활동이 가능하신 분",
            },
            {
              label: "[필수]",
              text: "Code assistant 또는 여러가지 도구를 활용하여 효율적으로 문제를 해결할 수 있으신 분",
            },
            { label: "[우대]", text: "오픈 소스 기여 경험이 있으신 분" },
            {
              label: "[우대]",
              text: "AWS 활용 경험 또는 환경 유지 보수 경험이 있으신 분",
            },
          ],
        },
        {
          heading: "총학생회 홈페이지",
          lines: [
            {
              label: "[필수]",
              text: "SpringBoot를 활용한 어플리케이션 개발 경험이 있으신 분",
            },
            {
              label: "[우대]",
              text: "유닛 테스트 및 통합 테스트 작성 경험이 있으신 분",
            },
            {
              label: "[우대]",
              text: "운영 환경의 편의성을 위한 간단한 백 오피스 어플리케이션 개발 경험이 있으신 분",
            },
          ],
        },
        {
          heading: "PASSU",
          lines: [
            {
              label: "[필수]",
              text: "Python을 활용한 웹/앱 어플리케이션 개발 경험이 있으신 분",
            },

            {
              label: "[우대]",
              text: "Django 또는 AWS Serverless 어플리케이션 개발 경험이 있으신 분",
            },
            {
              label: "[우대]",
              text: "Spike 트래픽에 대한 대응 경험이 있으신 분",
            },
          ],
        },
        {
          heading: "동아리연합회",
          lines: [
            {
              label: "[필수]",
              text: "Django 및 SpringBoot를 활용한 어플리케이션 개발 경험이 있으신 분",
            },
            {
              label: "[우대]",
              text: "타 클라우드 플랫폼 인프라를 AWS로 마이그레이션 한 경험이 있으신 분",
            },
            { label: "[우대]", text: "프로젝트 리팩토링 경험이 있으신 분" },
          ],
        },
        {
          heading: "SSUport",
          lines: [
            {
              label: "[필수]",
              text: "SpringBoot(Java)를 활용한 웹/앱 서비스 개발 경험이 있으신 분",
            },
            {
              label: "[우대]",
              text: "AWS 환경에서의 배포 경험이 있거나, 초기 서비스 성장 과정에 함께 도전해보고 싶으신 분",
            },
          ],
        },
      ]}
    />
  ),
  HR: (
    <Sections
      sections={[
        {
          heading: "자격요건",
          lines: [
            { label: "[필수]", text: "일정 관리와 적극적인 활동 참여 가능자" },
            {
              label: "[필수]",
              text: "리크루팅/조직 운영/행사 기획 중 최소 1개 이상 경험 또는 이에 준하는 프로젝트 운영 경험",
            },
            {
              label: "[필수]",
              text: "문서화 능력(노션 기반 운영 문서 정리, 체크리스트/가이드 작성 등) 및 커뮤니케이션 역량",
            },
            {
              label: "[필수]",
              text: "다양한 이해관계자(지원자/위원/외부 협업자)와의 소통에서 정확하고 빠르게 조율할 수 있는 분",
            },
            {
              label: "[필수]",
              text: "문제를 발견하면 “운영 구조”로 해결하려는 태도(임시방편이 아니라 재발 방지/표준화 지향)",
            },
            {
              label: "[필수]",
              text: "구성원의 성장과 팀 문화에 관심이 있고, 피드백 기반으로 프로세스를 개선할 수 있는 분",
            },
          ],
        },
        {
          heading: "우대사항",
          lines: [
            {
              label: "[우대]",
              text: "리크루팅 운영(지원서 관리/면접 운영/결과 안내) 경험",
            },
            {
              label: "[우대]",
              text: "커뮤니티/동아리/학생자치조직 등에서의 운영진 경험",
            },
            {
              label: "[우대]",
              text: "행사 기획 및 현장 운영 경험(대관/예산/홍보/운영 스태프 관리 등)",
            },
            {
              label: "[우대]",
              text: "데이터 기반 운영(설문, 지표 추적, 회고 템플릿 운영 등) 경험",
            },
          ],
        },
      ]}
    />
  ),
};

/** 선택된 부서의 자격요건/우대조건 콜아웃. 부서 미선택 시 undefined. */
export function departmentRequirementsFor(
  department: unknown,
): ReactNode | undefined {
  if (typeof department !== "string") return undefined;
  return REQUIREMENTS[department as DepartmentId];
}
