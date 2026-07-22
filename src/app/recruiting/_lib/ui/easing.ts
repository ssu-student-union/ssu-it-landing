/** 감속 곡선을 두 형태로 노출한다 — `motion` transition용 배열, rAF 스크롤용 함수. 곡선을 바꿀 땐 둘 다 함께 수정한다. */
export const EASE_EXPO_OUT = [0.19, 1, 0.22, 1] as const;

export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
