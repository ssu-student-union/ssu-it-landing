import { easeOutExpo } from "./easing";

/** 지정한 엘리먼트를 뷰포트 중앙으로 부드럽게 스크롤한다(`useFormState`의 스크롤-투-에러가 사용). */
export const scrollToElementCentered = (
  element: HTMLElement,
  duration = 600,
) => {
  const startY = window.scrollY;
  const targetY =
    startY +
    element.getBoundingClientRect().top -
    window.innerHeight / 2 +
    element.offsetHeight / 2;
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + (targetY - startY) * easeOutExpo(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};
