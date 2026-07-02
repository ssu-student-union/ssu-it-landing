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
- 커스텀 테마는 `globals.css`의 `@theme inline` 블록에 정의
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
```

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
