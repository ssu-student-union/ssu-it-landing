/**
 * currentColor 셰브런. Figma의 gis:arrow 경로를 그대로 쓰되 색을 상속받도록 인라인한다
 * (에셋 `arrow.svg`는 어두운 Hero 버튼용으로 stroke가 #EFEFEF로 구워져 있어 밝은 배경에서
 * 안 보이고 recolor도 안 된다). 섹션 타이틀 마커와 FAQ 토글 아이콘이 공유한다.
 */
export const ChevronIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 42 42" fill="none" aria-hidden="true" className={className}>
    <path
      d="M17.5 29.75L26.25 21L17.5 12.25"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
