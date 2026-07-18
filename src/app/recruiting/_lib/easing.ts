/**
 * 리크루팅 폼 전반에서 쓰는 하나의 감속 곡선을 세 가지 형태로 노출한다 —
 * Tailwind `ease-*` 유틸(CSS 문자열), `motion`의 `transition.ease`(배열),
 * 수동 rAF 스크롤(JS 함수). 세 값이 시각적으로 같은 곡선이어야 하므로,
 * 곡선을 바꿀 땐 세 곳을 함께 수정해야 한다.
 */
export const EASE_EXPO_OUT_CSS = "cubic-bezier(0.19, 1, 0.22, 1)";

export const EASE_EXPO_OUT = [0.19, 1, 0.22, 1] as const;

export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
