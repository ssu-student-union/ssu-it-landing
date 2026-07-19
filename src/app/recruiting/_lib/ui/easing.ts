/** 감속 곡선을 두 형태로 노출한다 — `motion` transition용 배열, rAF 스크롤용 함수. `globals.css`의 `--ease-expo-out`이 같은 곡선을 맡으므로 셋을 함께 수정해야 한다. */
export const EASE_EXPO_OUT = [0.19, 1, 0.22, 1] as const;

export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
