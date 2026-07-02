---
description: General instructions for agents
alwaysApply: true
---

# AGENTS.md

AI 어시스턴트가 이 저장소에서 작업할 때 참고하는 가이드.

## 프로젝트 개요

SSU IT Landing은 숭실대하교 IT지원위원회의 공식 홈페이지이다.

## AGENTS.md 역할

각 폴더의 `AGENTS.md`는 **해당 폴더의 개요와 컨벤션**을 설명한다. 기술 상세는 TECH.md에, 사용자 대상 설명은 README.md에 작성한다.

### 필수 3섹션

- **디렉토리 개요**: 폴더의 역할을 1-2문장으로 설명하고 상/하위 연결만 간단히 언급한다.
- **파일 작성 컨벤션**: 파일/디렉토리 네이밍 규칙과 barrel file 사용 원칙을 적는다.
- **코드 작성 컨벤션**: 해당 폴더에 적용되는 패턴과 import/export 규칙을 정리한다.

## 문서 역할 분리

| 문서          | 역할                 | 대상      |
|-------------|--------------------|---------|
| `AGENTS.md` | 폴더 개요 + 컨벤션        | AI 에이전트 |
| `TECH.md`   | 기술 상세, 아키텍처, 명령어   | AI 에이전트 |
| `README.md` | 패키지 소개, 사용법, 개발 방법 | 사람      |

각 패키지/폴더별 세부 규칙은 해당 디렉토리의 `AGENTS.md`에 명시되어 있으며, 해당 경로에서 작업할 때만 읽힌다.

## Boundaries

- ✅ **Always:**
    - `pnpm generate:all` 실행 후 변경사항 확인
    - 테스트 실행 후 커밋 (`pnpm test:all`)

- ⚠️ **Ask first:**
    - 새 패키지 추가
    - tsconfig/biome.json 설정 변경
    - CI 워크플로우 수정
    - 외부 의존성 추가

- 🚫 **Never:**
    - `.env`, API 키, 시크릿 커밋
    - `npm`/`bun`/`yarn` 사용 (`pnpm` 전용)
    - `dist/`, `node_modules/` 수정

## Git 규칙

- **커밋 메시지는 Conventional Commits 형식을 따른다: `type(scope): subject`
    - 예: `feat(button): add loading state`, `fix(tooltip): correct z-index`, `docs: update component rules`
- **PR 제목도 커밋 메시지와 동일한 Conventional Commits 형식을 따른다.