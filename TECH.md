# TECH.md

## 기술 스택

- 런타임/패키지 관리: Node.js, pnpm
- 프레임워크: Next.js (App Router)
- UI 라이브러리: React 19
- 타입 시스템: TypeScript v6
- 스타일링: Tailwind CSS v4
- 서버 상태 관리: TanStack Query v5
- 린트/포맷: Biome v2

버전 정보는 문서에 중복 기재하지 않는다. 버전 확인은 루트 `package.json`을 단일 소스로 사용한다.

## 공통 규칙

### TypeScript

- `any`, `as unknown` 사용 금지 (명시적 승인 없이)
- 타입 import는 항상 `type` 키워드 사용
- `strict: true` 설정 준수

### Barrel Import

- `src/app/` 제외한 모든 디렉토리에 `index.ts`를 두어 public API를 노출한다.
- 모듈 외부에서 해당 디렉토리 내부 파일을 직접 import하지 않는다.
- `src/app/`은 Next.js 라우팅 규칙을 따르므로 barrel을 두지 않는다.

```
// ✅
import { Button } from "../components";

// ❌
import { Button } from "../components/Button/Button";
```

### 패키지 관리

- 항상 `pnpm` 사용 (`npm`/`yarn`/`bun` 금지)
- `package.json` 직접 수정 금지 (`pnpm add 패키지명`으로 설치)

### 스타일링

- Tailwind CSS v4 사용 (`@import "tailwindcss"` 방식)
- 커스텀 테마는 `globals.css`의 `@theme` 블록에 정의. 색상은 시맨틱
  토큰(`--color-brand`, `--color-surface` 등)으로 두고 컴포넌트에서는
  `bg-brand`처럼 토큰 유틸만 사용한다 — hex 값을 `bg-[#...]` 형태로
  하드코딩하지 않는다. 다른 CSS 변수를 참조하는 값(폰트 등)만 `@theme inline`에 둔다.
- CSS 변수는 `:root`에 선언, 다크모드는 `prefers-color-scheme: dark` 미디어 쿼리 사용

---

## 아키텍처 개요

Next.js App Router 기반 단일 패키지 프로젝트다.

```text
src/
  app/           # Next.js App Router 라우트 및 레이아웃
    layout.tsx   # 루트 레이아웃
    page.tsx     # 홈페이지
    globals.css  # 전역 스타일 (Tailwind 진입점)
    api/         # Route Handler (서버 전용 엔드포인트)
  server/        # 서버 전용 로직. `import "server-only"`로 클라이언트 번들
                 # 유입을 빌드 타임에 차단한다. src/app/api/**만 import한다.
scripts/         # 1회성 개발 도구. 앱 코드에서 import되지 않는다.
```

### HTTP 클라이언트

서버·클라이언트 모두 네이티브 `fetch`를 사용한다. 서버 영역에서는 Next.js가
전역 fetch를 확장해 캐싱(`cache`)·재검증(`revalidate`)을 통합하고, 클라이언트
컴포넌트에서는 타임아웃이 필요하면 `AbortSignal.timeout()`을 사용한다. 별도
HTTP 클라이언트 라이브러리는 도입하지 않는다.

---

## Notion 연동

리크루팅 지원서(`src/app/recruiting/`) 3단계를 모두 채우고 "완료"를 누르면
`src/app/api/recruiting/submit/route.ts`가 Notion 데이터베이스에 페이지 하나로
저장한다.

⚠️ Notion API는 2025-09-03에 "database"와 "data source"를 분리했다. 페이지 생성은
`database_id`가 아니라 `data_source_id`를 요구한다 (`@notionhq/client` v5 기준).
사람은 `NOTION_DATABASE_ID`만 다루면 되도록, `src/server/notion/resolveDataSource.ts`가
`databases.retrieve`로 실제 data source id를 조회해 모듈 캐시한다.

### 환경 변수

`.env.example` 참고, `.env.local`에 설정한다.

| 변수 | 용도 |
|---|---|
| `NOTION_API_KEY` | Notion 내부 통합(internal integration) Secret. 앱 런타임 필요 |
| `NOTION_DATABASE_ID` | 지원서를 저장할 데이터베이스 ID. 앱 런타임 필요 |
| `NOTION_PARENT_PAGE_ID` | `scripts/create-notion-database.ts` 실행 시에만 필요 |

### 셋업

1. notion.so/my-integrations 에서 내부 통합 생성 → Secret 발급 → `NOTION_API_KEY`
2. 워크스페이스에 빈 페이지 1개 생성 → `···` 메뉴 → Connections에서 위 통합 연결 →
   페이지 ID를 `NOTION_PARENT_PAGE_ID`로
3. `pnpm exec tsx scripts/create-notion-database.ts` 실행 → 프로퍼티 17개가
   자동 생성된 데이터베이스의 `database_id`가 출력됨 → `NOTION_DATABASE_ID`로

select/multi-select 옵션(학년/학기, 지원 부서, 희망 Task)은 스크립트가
`src/data/recruitingStepOne.tsx`/`recruitingStepTwo.tsx`/`recruitingSchedule.ts`에서
직접 끌어와 생성한다 — 앱 UI가 바뀌면 스크립트를 다시 실행해 옵션을 맞출 수 있다.

### 프로퍼티 매핑

프로퍼티 이름은 `src/server/notion/propertyNames.ts`(`NOTION_PROPERTIES`)에서
관리한다. 폼 필드와 1:1 대응이 기본이지만, `interviewAvailability`/`otherTime`은
지원자가 둘 중 하나만 채우는 상호배타 필드라 "면접 가능 일정" 하나로 합쳐
직렬화한다 — 표준 슬롯을 골랐으면 그 상세 텍스트, "가능한 시간 없음"으로 대체
일정을 입력했으면 `[대체 일정]` 접두어를 붙인 텍스트 (`src/server/notion/mapPayloadToProperties.ts`의
`summarizeInterviewSchedule`). 필터링용으로 날짜만 뽑은 "면접 가능 날짜"(multi_select)와
"대체 일정 필요"(checkbox)는 별도로 유지한다.

| Notion 프로퍼티 | 타입 | 매핑 필드 |
|---|---|---|
| 이름 | title | `stepOne.name` |
| 학번 | rich_text | `stepOne.studentId` |
| 전화번호 | phone_number | `stepOne.phone` |
| 단과대학 | rich_text | `stepOne.college` |
| 학과(전공) | rich_text | `stepOne.department` |
| 학년/학기 | select | `stepOne.grade` |
| 개인정보 동의 | checkbox | `stepOne.agree` |
| 면접 가능 날짜 | multi_select | `stepOne.interviewAvailability`의 key (필터용) |
| 면접 가능 일정 | rich_text | 표준 슬롯 상세 또는 `[대체 일정]` + `stepOne.otherTime` (통합) |
| 대체 일정 필요 | checkbox | `stepOne.noAvailableTime` (필터용) |
| 지원 부서 | select | `stepTwo.department` |
| 희망 Task | multi_select | `stepTwo.tasks` |
| 지원 동기 | rich_text | `stepTwo.motivation` |
| 인재상 부합 이유 | rich_text | `stepTwo.fitReason` |
| 역량 서술 | rich_text | `stepTwo.skillAnswer` |
| 포트폴리오 링크 | url | `stepThree.portfolioLink` |
| 포트폴리오 파일 | files | 업로드된 파일 (Notion File Upload API) |
| 제출 일시 | created_time | Notion 자동 관리 |

### 기본 뷰

Notion에서 DB를 처음 열었을 때 보이는 "Default view"는 스크리닝에 필요한
최소 컬럼(이름/지원 부서/학년·학기/포트폴리오 링크·파일/제출 일시)만 표시하고,
지원 부서로 그룹핑, 제출 일시 최신순 정렬돼 있다. 나머지 프로퍼티는 컬럼에서만
숨겨진 것이고 행을 열면 전부 그대로 보인다 — 새 프로퍼티를 추가하면 이 뷰의
SHOW 목록에 넣을지 검토한다.

### 파일 업로드

포트폴리오 파일(최대 10MB, `portfolio/schema.ts`의 `MAX_FILE_SIZE`)은 Notion File
Upload API(single-part)로 실제 페이지에 첨부한다 (`src/server/notion/uploadPortfolioFile.ts`).
single-part 업로드는 플랜과 무관하게 API 자체가 파일당 ~20MB로 제한한다 — 워크스페이스가
Free 플랜이면 그보다 낮은 5MB에서 먼저 막힌다(Plus 이상은 이 20MB 한도가 그대로 실질 상한).
20MB를 넘는 파일을 받으려면 multi-part 업로드(파일을 여러 조각으로 나눠 전송 후 조립)를
별도로 구현해야 한다.

---

## 주요 명령어

### 개발

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |

### 린트/포맷

| 명령어 | 설명 |
|--------|------|
| `pnpm lint` | Biome 전체 검사 (`biome check`) |
| `pnpm format` | 코드 포맷 정리 (`biome format --write`) |

---

## Biome 설정

- 들여쓰기: 스페이스 2칸
- import 자동 정렬: `organizeImports: on`
- Next.js, React 도메인 규칙 적용
- `.next/`, `dist/`, `build/`, `node_modules/` 검사 제외
